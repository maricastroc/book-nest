import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

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
    select: { avatarUrl: true, name: true, id: true, createdAt: true },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

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
    data: {
      user,
      submittedBooks: submittedBooksWithDetails,
    },
  })
}
