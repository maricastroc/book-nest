import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  try {
    const userId = String(session?.user.id)

    const ratings = await prisma.rating.findMany({
      where: {
        ...(userId && { userId: { not: userId } }),
        NOT: { description: '' },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        book: {
          include: {
            ratings: {
              include: { user: true },
            },
            categories: {
              include: { category: true },
            },
          },
        },
        user: true,
      },
      take: 5,
    })

    const bookIds = ratings.map((rating) => rating.book.id)

    const booksAvgRating = await prisma.rating.groupBy({
      by: ['bookId'],
      where: { bookId: { in: bookIds } },
      _avg: { rate: true },
    })

    const userReadingStatus = await prisma.readingStatus.findMany({
      where: {
        userId: String(session?.user.id),
        bookId: { in: bookIds },
      },
    })

    const ratingsWithBookAndCategories = ratings.map((rating) => {
      const bookAvgRating = booksAvgRating.find(
        (avgRating) => avgRating.bookId === rating.book.id,
      )

      const readingStatus = userReadingStatus.find(
        (status) => status.bookId === rating.book.id,
      )?.status

      return {
        ...rating,
        book: {
          ...rating.book,
          rate: bookAvgRating?._avg.rate || null,
          categories: rating.book.categories.map(
            (category) => category.category,
          ),
          readingStatus: readingStatus
            ? formatToSnakeCase(readingStatus)
            : null,
        },
      }
    })

    return res.status(200).json({ ratings: ratingsWithBookAndCategories })
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
