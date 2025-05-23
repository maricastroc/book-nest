/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { IncomingForm } from 'formidable'
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import fs from 'fs/promises'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'
import sharp from 'sharp'

export const config = {
  api: {
    bodyParser: false,
  },
}

const getSingleString = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0]
  if (typeof value === 'string') return value
  throw new Error('Field is required')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  if (!session)
    return res.status(401).json({ message: 'Authentication required' })

  const form = new IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'Error processing form' })

    try {
      const name = getSingleString(fields.name)
      const author = getSingleString(fields.author)
      const summary = getSingleString(fields.summary)
      const publisher = getSingleString(fields.publisher)
      const language = getSingleString(fields.language)
      const isbn = getSingleString(fields.isbn)
      const totalPages = parseInt(getSingleString(fields.totalPages), 10)
      const publishingYear = parseInt(
        getSingleString(fields.publishingYear),
        10,
      )
      const categories = JSON.parse(getSingleString(fields.categories) || '[]')
      const coverSource = getSingleString(fields.coverSource)
      const coverFile = files.coverUrl?.[0]
      const coverUrlFromOpenLibrary = fields.coverUrl?.[0]

      const existingBook = await prisma.book.findFirst({
        where: {
          OR: [{ isbn }, { name, author }],
        },
      })

      if (existingBook) {
        return res.status(400).json({
          message: 'This book already exists in our platform',
          existingBook: {
            id: existingBook.id,
            name: existingBook.name,
          },
        })
      }

      const createBookSchema = z.object({
        name: z.string().min(1),
        author: z.string().min(1),
        summary: z.string().min(1),
        totalPages: z.number().positive(),
        publishingYear: z.number().int(),
        categories: z.array(z.string()).nonempty(),
      })

      await createBookSchema.parseAsync({
        name,
        author,
        summary,
        totalPages,
        publishingYear,
        categories,
      })

      let finalCoverUrl: string

      if (coverSource === 'openlibrary' && coverUrlFromOpenLibrary) {
        finalCoverUrl = getSingleString(coverUrlFromOpenLibrary)
      } else if (coverFile) {
        const MAX_SIZE = 2 * 1024 * 1024

        const fileBuffer = await fs.readFile(coverFile.filepath)

        if (fileBuffer.length > MAX_SIZE) {
          await fs.unlink(coverFile.filepath)
          return res
            .status(400)
            .json({ message: 'A imagem deve ter menos de 2MB' })
        }

        const optimizedImage = await sharp(fileBuffer)
          .resize(800, 800, { fit: 'inside' })
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer()

        const base64Image = optimizedImage.toString('base64')
        finalCoverUrl = `data:${coverFile.mimetype};base64,${base64Image}`

        await fs.unlink(coverFile.filepath)
      } else {
        return res.status(400).json({ message: 'Cover image is required' })
      }

      // Criação do livro
      const newBook = await prisma.book.create({
        data: {
          name,
          author,
          summary,
          publisher,
          totalPages,
          language,
          isbn,
          publishingYear: publishingYear.toString(),
          coverUrl: finalCoverUrl,
          userId: String(session.user.id),
          categories: {
            create: categories.map((categoryId: string) => ({
              category: { connect: { id: categoryId } },
            })),
          },
        },
        include: {
          categories: true,
        },
      })

      return res.status(201).json({
        book: newBook,
        message: 'Book successfully created!',
      })
    } catch (error) {
      if (files.coverUrl?.[0]) {
        await fs.unlink(files.coverUrl[0].filepath).catch(() => {})
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message })
      }
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : 'Internal server error',
      })
    }
  })
}
