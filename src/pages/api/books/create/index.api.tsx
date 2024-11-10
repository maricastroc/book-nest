import { IncomingForm } from 'formidable'
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export const config = {
  api: {
    bodyParser: false,
  },
}

const getSingleString = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0]
  }

  if (typeof value === 'string') {
    return value
  }

  throw new Error('Field is required')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  const form = new IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error processing form' })
    }

    try {
      const name = getSingleString(fields.name)
      const author = getSingleString(fields.author)
      const summary = getSingleString(fields.summary)
      const totalPages = parseInt(getSingleString(fields.totalPages), 10)
      const publishingYear = parseInt(
        getSingleString(fields.publishingYear),
        10,
      )
      const categories = JSON.parse(getSingleString(fields.categories) || '[]')
      const coverFile = files.coverUrl?.[0]

      if (!coverFile) {
        return res.status(400).json({ message: 'Cover file is required.' })
      }

      const existingBook = await prisma.book.findFirst({
        where: { name },
      })

      if (existingBook) {
        return res
          .status(400)
          .json({ message: 'A book with this name already exists.' })
      }

      const createBookSchema = z.object({
        name: z.string().min(1, 'Name is required'),
        author: z.string().min(1, 'Author is required'),
        summary: z.string().min(1, 'Summary is required'),
        totalPages: z.number().positive('Page number must be positive'),
        publishingYear: z.number().int('Publishing year must be an integer'),
        categories: z.array(z.string()).nonempty('Categories are required'),
      })

      await createBookSchema.parseAsync({
        name,
        author,
        summary,
        totalPages,
        publishingYear,
        categories,
      })

      const coverPath = path.join(
        process.cwd(),
        'public',
        'images',
        'books',
        coverFile.originalFilename ?? '',
      )
      fs.renameSync(coverFile.filepath, coverPath)

      const newBook = await prisma.book.create({
        data: {
          name,
          author,
          summary,
          totalPages,
          publishingYear: publishingYear.toString(),
          coverUrl: `/images/books/${coverFile.originalFilename}`,
          userId: session.user.id.toString(),
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

      return res.status(201).json(newBook)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message })
      } else if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
      return res.status(500).json({ message: 'Internal server error' })
    }
  })
}
