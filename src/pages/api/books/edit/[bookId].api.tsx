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

type UpdateBookData = {
  name?: string
  author?: string
  summary?: string
  language?: string
  publisher?: string
  totalPages?: number
  publishingYear?: string
  coverUrl?: string
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
      const publisher = getSingleString(fields.publisher)
      const summary = getSingleString(fields.summary)
      const language = getSingleString(fields.language)
      const totalPages = parseInt(getSingleString(fields.totalPages), 10)
      const publishingYear = parseInt(
        getSingleString(fields.publishingYear),
        10,
      )
      const categories = JSON.parse(getSingleString(fields.categories) || '[]')

      const id = String(req.query.bookId)

      if (!id) {
        return res.status(400).json({ message: 'Book ID is required.' })
      }

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

      const updateData: UpdateBookData = {}

      if (summary) updateData.summary = summary
      if (publisher) updateData.publisher = publisher
      if (language) updateData.language = language
      if (totalPages) updateData.totalPages = totalPages
      if (publishingYear) updateData.publishingYear = publishingYear.toString()

      if (categories) {
        const book = await prisma.book.findUnique({
          where: { id: bookId },
        })

        if (!book) {
          return res.status(404).json({ message: 'Book not found' })
        }

        const validCategories = await prisma.category.findMany({
          where: {
            id: {
              in: categories,
            },
          },
        })

        if (validCategories.length !== categories.length) {
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
          (categoryId) => !categories.includes(categoryId),
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

        const categoriesToConnect = categories
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

        if (categories.length === 0) {
          return res
            .status(400)
            .json({ message: 'A book must have at least one category' })
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
        return res.status(400).json({ message: error.errors[0].message })
      } else if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
      return res.status(500).json({ message: 'Internal server error' })
    }
  })
}
