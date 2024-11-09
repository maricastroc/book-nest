import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end('Please login to access this API route.')
  }

  try {
    const userId = String(session.user.id)

    const userLastRating = await prisma.rating.findFirst({
      where: { userId, NOT: { OR: { description: '' } } },
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          include: {
            ratings: {
              include: { user: true },
            },
            categories: {
              include: { category: true },
            },
            readingStatus: {
              where: { userId },
            },
          },
        },
        user: true,
      },
    })

    if (!userLastRating) {
      return res
        .status(404)
        .json({ message: 'No ratings found for this user.' })
    }

    const bookId = userLastRating.book.id

    const bookAvgRating = await prisma.rating.groupBy({
      by: ['bookId'],
      where: { bookId },
      _avg: { rate: true },
    })

    const avgRating =
      bookAvgRating.length > 0 ? bookAvgRating[0]._avg.rate : null
    const readingStatus = userLastRating.book.readingStatus?.[0]?.status ?? null

    const bookWithFixedCategories = {
      ...userLastRating.book,
      categories: userLastRating.book.categories.map(
        (category) => category.category,
      ),
      rate: avgRating,
      readingStatus,
    }

    const userLastRatingWithAvg = {
      ...userLastRating,
      book: bookWithFixedCategories,
    }

    return res.json({ rating: userLastRatingWithAvg })
  } catch (error) {
    console.error('Error fetching user last rating:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
