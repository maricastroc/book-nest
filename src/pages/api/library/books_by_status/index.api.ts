import { prisma } from '@/lib/prisma'
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

  const books = await prisma.book.findMany({
    where: {
      status: 'APPROVED',
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
    const status = book.readingStatus[0]?.status || 'unknown'

    const bookWithDetails: BookWithStatus = {
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

  Object.keys(booksByStatus).forEach((status) => {
    booksByStatus[status] = booksByStatus[status].slice(0, 8)
  })

  return res.json({
    data: {
      booksByStatus,
    },
  })
}
