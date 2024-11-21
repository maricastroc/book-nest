import { prisma } from '@/lib/prisma'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { NextApiRequest, NextApiResponse } from 'next'

interface BookWithStatus {
  id: string
  name: string
  author: string
  coverUrl: string
  userRating: null | number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' })
  }

  const user = await prisma.user.findUnique({
    where: { id: String(userId) },
    select: { avatarUrl: true, name: true, id: true },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const books = await prisma.book.findMany({
    where: {
      OR: [
        {
          readingStatus: {
            some: { userId: String(userId) },
          },
        },
        {
          userId: String(userId),
        },
      ],
    },
    select: {
      id: true,
      name: true,
      author: true,
      coverUrl: true,
      readingStatus: {
        where: { userId: String(userId) },
        select: { status: true },
      },
      ratings: {
        where: { userId: String(userId) },
        select: { rate: true },
      },
    },
  })

  const booksByStatus = books.reduce((acc, book) => {
    const userRating = book.ratings.length > 0 ? book.ratings[0].rate : null
    const status = formatToSnakeCase(book.readingStatus[0]?.status || 'unknown')

    const bookWithDetails = {
      id: book.id,
      name: book.name,
      author: book.author,
      coverUrl: book.coverUrl,
      userRating,
    }

    if (!acc[status]) {
      acc[status] = []
    }

    acc[status].push(bookWithDetails)
    return acc
  }, {} as { [status: string]: BookWithStatus[] })

  const submittedBooks = await prisma.book.findMany({
    where: { userId: String(userId) },
    select: {
      id: true,
      name: true,
      author: true,
      coverUrl: true,
      publisher: true,
      isbn: true,
      language: true,
      summary: true,
      totalPages: true,
      publishingYear: true,
      _count: {
        select: { ratings: true },
      },
      ratings: {
        select: {
          rate: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
  })

  const submittedBooksWithDetails = submittedBooks.map((book) => {
    const ratingCount = book._count.ratings
    const avgRate =
      ratingCount > 0
        ? book.ratings.reduce((sum, rating) => sum + rating.rate, 0) /
          ratingCount
        : 0

    return {
      ...book,
      categories: book.categories.map((category) => category.category),
      ratingCount,
      rate: avgRate,
    }
  })

  return res.json({
    user: {
      avatarUrl: user.avatarUrl,
      name: user.name,
      id: user.id,
    },
    booksByStatus,
    submittedBooks: submittedBooksWithDetails,
  })
}
