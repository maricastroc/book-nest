/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { IncomingForm } from 'formidable'
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import fs from 'fs/promises'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export const config = {
  api: {
    bodyParser: false,
  },
}

const updateBookSchema = z.object({
  name: z.string().min(1, { message: 'Book name is required.' }).optional(),
  author: z.string().min(1, { message: 'Author name is required.' }).optional(),
  summary: z.string().min(1, { message: 'Summary is required.' }).optional(),
  language: z.string().min(1, { message: 'Language is required.' }).optional(),
  publisher: z
    .string()
    .min(1, { message: 'Publisher is required.' })
    .optional(),
  totalPages: z
    .preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z
        .number()
        .positive({ message: 'Total pages must be greater than zero.' }),
    )
    .optional(),
  publishingYear: z
    .preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z.number().int({ message: 'Publishing year must be a number.' }),
    )
    .optional(),
  categories: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val)
        } catch {
          return []
        }
      }
      return val
    }, z.array(z.string()).nonempty({ message: 'At least one category is required.' }))
    .optional(),
  coverSource: z.string().optional(),
  coverUrl: z.string().optional(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') return res.status(405).end()

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
      const rawData: any = {}
      const getSingleString = (
        value: string | string[] | undefined,
      ): string => {
        if (Array.isArray(value)) return value[0]
        if (typeof value === 'string') return value
        return ''
      }

      if (fields.name) rawData.name = getSingleString(fields.name)
      if (fields.author) rawData.author = getSingleString(fields.author)
      if (fields.summary) rawData.summary = getSingleString(fields.summary)
      if (fields.language) rawData.language = getSingleString(fields.language)
      if (fields.publisher)
        rawData.publisher = getSingleString(fields.publisher)
      if (fields.totalPages)
        rawData.totalPages = getSingleString(fields.totalPages)
      if (fields.publishingYear)
        rawData.publishingYear = getSingleString(fields.publishingYear)
      if (fields.categories)
        rawData.categories = getSingleString(fields.categories)
      if (fields.coverUrl) rawData.coverUrl = getSingleString(fields.coverUrl)

      const validatedData = updateBookSchema.parse(rawData)

      const id = String(req.query.bookId)
      const bookId = Array.isArray(id) ? id[0] : id

      const existingBook = await prisma.book.findUnique({
        where: { id: bookId },
        include: { categories: true },
      })

      if (!existingBook) {
        return res.status(404).json({ message: 'Book not found.' })
      }

      if (
        session.user.role !== 'ADMIN' &&
        existingBook.userId !== session.user.id
      ) {
        return res
          .status(403)
          .json({ message: 'You can only edit your own books.' })
      }

      const updateData: any = { ...validatedData }

      // Processar a nova capa se fornecida
      const coverFile = files.coverUrl?.[0]
      if (coverFile) {
        const MAX_SIZE = 2 * 1024 * 1024 // 2MB
        const fileBuffer = await fs.readFile(coverFile.filepath)

        if (fileBuffer.length > MAX_SIZE) {
          await fs.unlink(coverFile.filepath)
          return res
            .status(400)
            .json({ message: 'Image must be less than 2MB' })
        }

        const base64Image = fileBuffer.toString('base64')
        updateData.coverUrl = `data:${coverFile.mimetype};base64,${base64Image}`

        await fs.unlink(coverFile.filepath)
      }

      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key],
      )

      if (validatedData.categories) {
        const validCategories = await prisma.category.findMany({
          where: { id: { in: validatedData.categories } },
        })

        if (validCategories.length !== validatedData.categories.length) {
          return res
            .status(400)
            .json({ message: 'Some categories are invalid' })
        }

        const currentCategories = await prisma.categoriesOnBooks.findMany({
          where: { bookId },
          select: { categoryId: true },
        })

        const currentCategoryIds = currentCategories.map((c) => c.categoryId)

        const categoriesToRemove = currentCategoryIds.filter(
          (categoryId) => !validatedData.categories?.includes(categoryId),
        )

        if (categoriesToRemove.length > 0) {
          await prisma.categoriesOnBooks.deleteMany({
            where: { bookId, categoryId: { in: categoriesToRemove } },
          })
        }

        const categoriesToConnect = validatedData.categories
          .filter(
            (categoryId: string) => !currentCategoryIds.includes(categoryId),
          )
          .map((categoryId: string) => ({ bookId, categoryId }))

        if (categoriesToConnect.length > 0) {
          await prisma.categoriesOnBooks.createMany({
            data: categoriesToConnect,
            skipDuplicates: true,
          })
        }
      }

      if (updateData.publishingYear !== undefined) {
        updateData.publishingYear = String(updateData.publishingYear)
      }

      delete updateData.categories

      const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: updateData,
        include: { categories: true },
      })

      return res.status(200).json({
        book: updatedBook,
        message: 'Book successfully updated!',
      })
    } catch (error) {
      if (files.coverUrl?.[0]) {
        await fs.unlink(files.coverUrl[0].filepath).catch(() => {})
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors.map((e) => e.message),
        })
      }

      return res.status(500).json({
        message:
          error instanceof Error ? error.message : 'Internal server error',
      })
    }
  })
}
