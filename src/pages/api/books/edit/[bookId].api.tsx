/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingForm } from 'formidable'
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export const config = {
  api: {
    bodyParser: false,
  },
}

const updateBookSchema = z.object({
  name: z.string().min(1, { message: 'Book name is required.' }).optional(),
  author: z
    .string()
    .min(1, { message: 'Author name is required..' })
    .optional(),
  summary: z
    .string()
    .min(1, { message: 'Summary name is required.' })
    .optional(),
  language: z.string().min(1, { message: 'Language is required.' }).optional(),
  publisher: z
    .string()
    .min(1, { message: 'Publisher is required.' })
    .optional(),
  totalPages: z
    .preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z.number().positive({
        message: 'Total pages must be greater than zero.',
      }),
    )
    .optional(),
  publishingYear: z
    .preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z.number().int({
        message: 'Publishing year must be a number.',
      }),
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

  form.parse(req, async (err, fields) => {
    if (err) {
      return res.status(500).json({ message: 'Error processing form' })
    }

    try {
      const rawData: any = {}

      if (fields.name) rawData.name = fields.name[0]
      if (fields.author) rawData.author = fields.author[0]
      if (fields.summary) rawData.summary = fields.summary[0]
      if (fields.language) rawData.language = fields.language[0]
      if (fields.publisher) rawData.publisher = fields.publisher[0]
      if (fields.totalPages) rawData.totalPages = fields.totalPages[0]
      if (fields.publishingYear)
        rawData.publishingYear = fields.publishingYear[0]
      if (fields.categories) rawData.categories = fields.categories[0]

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

      if (existingBook.userId !== session.user.id) {
        return res
          .status(403)
          .json({ message: 'You can only edit your own books.' })
      }

      const updateData: any = {}
      if (validatedData.name) updateData.name = validatedData.name
      if (validatedData.author) updateData.author = validatedData.author
      if (validatedData.summary) updateData.summary = validatedData.summary
      if (validatedData.language) updateData.language = validatedData.language
      if (validatedData.publisher)
        updateData.publisher = validatedData.publisher
      if (validatedData.totalPages)
        updateData.totalPages = validatedData.totalPages
      if (validatedData.publishingYear)
        updateData.publishingYear = validatedData.publishingYear.toString()

      if (validatedData.categories) {
        const validCategories = await prisma.category.findMany({
          where: {
            id: {
              in: validatedData.categories,
            },
          },
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
            where: {
              bookId,
              categoryId: {
                in: categoriesToRemove,
              },
            },
          })
        }

        const categoriesToConnect = validatedData.categories
          .filter(
            (categoryId: string) => !currentCategoryIds.includes(categoryId),
          )
          .map((categoryId: string) => ({
            bookId,
            categoryId,
          }))

        if (categoriesToConnect.length > 0) {
          await prisma.categoriesOnBooks.createMany({
            data: categoriesToConnect,
            skipDuplicates: true,
          })
        }
      }

      const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: updateData,
        include: { categories: true },
      })

      return res
        .status(200)
        .json({ book: updatedBook, message: 'Book successfully updated!' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors.map((e) => e.message),
        })
      } else if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }

      return res.status(500).json({ message: 'Internal server error' })
    }
  })
}
