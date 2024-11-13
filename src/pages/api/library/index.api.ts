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

  const { userId, category, search } = req.query

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' })
  }

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

  // Busca o usuário para obter `avatarUrl` e `name`
  const user = await prisma.user.findUnique({
    where: {
      id: String(userId),
    },
    select: {
      avatarUrl: true,
      name: true,
      id: true,
    },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const books = await prisma.book.findMany({
    where: {
      categories: categoriesQuery,
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { author: { contains: searchQuery, mode: 'insensitive' } },
            ],
          }
        : {}),
      readingStatus: {
        some: { userId: String(userId) },
      },
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
        where: { userId: String(userId) },
      },
    },
  })

  const booksWithCategories = books.map((book) => {
    const avgRate =
      book.ratings.reduce((sum, rating) => sum + rating.rate, 0) /
        book.ratings.length || 0

    const userRating =
      book.ratings.find((rating) => rating.userId === String(userId))?.rate ||
      null

    const categories = book.categories.map((cat) => cat.category)

    return {
      ...book,
      categories,
      rate: avgRate,
      userRating,
      ratings: book.ratings,
      readingStatus: book.readingStatus[0]?.status || undefined,
    }
  })

  const booksByStatus = booksWithCategories.reduce((acc, book) => {
    const status = book.readingStatus
      ? formatToSnakeCase(book.readingStatus)
      : 'unknown'

    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(book)
    return acc
  }, {} as { [status: string]: typeof booksWithCategories })

  return res.json({
    user: {
      avatarUrl: user.avatarUrl,
      name: user.name,
      id: user.id,
    },
    booksByStatus,
  })
}
