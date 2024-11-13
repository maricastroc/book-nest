import { prisma } from '@/lib/prisma'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const userId = String(req.query.userId)

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' })
  }

  const { category, search } = req.query

  let categoriesQuery
  if (category) {
    categoriesQuery = {
      some: {
        categoryId: String(category),
      },
    }
  }

  let searchQuery
  if (search) {
    searchQuery = String(search).toLowerCase()
  }

  const books = await prisma.book.findMany({
    where: {
      userId,
      categories: categoriesQuery,
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { author: { contains: searchQuery, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      ratings: {
        include: {
          user: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      readingStatus: {
        where: { userId },
      },
    },
  })

  const booksWithCategories = books.map((book) => {
    const avgRate =
      book.ratings.length > 0
        ? book.ratings.reduce((sum, rating) => sum + rating.rate, 0) /
          book.ratings.length
        : 0

    const userRating =
      book.ratings.find((rating) => rating.userId === userId)?.rate || null

    const categories = book.categories.map((cat) => cat.category)

    const formattedReadingStatus = book.readingStatus?.[0]?.status
      ? formatToSnakeCase(book.readingStatus[0].status)
      : null

    return {
      ...book,
      categories,
      rate: avgRate,
      userRating,
      readingStatus: formattedReadingStatus,
    }
  })

  return res.json({ books: booksWithCategories })
}
