import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession, Session } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const bookId = String(req.query.bookId)

  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const session: Session | null = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
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
      ...(session
        ? {
            readingStatus: {
              where: {
                userId: String(session?.user?.id),
              },
            },
          }
        : {}),
    },
  })

  if (!book) {
    return res.status(400).json({ message: 'Book does not exist.' })
  }

  const bookAvgRating = await prisma.rating.groupBy({
    by: ['bookId'],
    where: {
      bookId: book.id,
    },
    _avg: {
      rate: true,
    },
  })

  const avgRate = bookAvgRating.length > 0 ? bookAvgRating[0]._avg.rate : NaN

  const readingStatus = book.readingStatus?.[0]?.status || null

  const bookWithDetails = {
    ...book,
    categories: book.categories.map((category) => category.category),
    ratings: session?.user?.id
      ? book.ratings.filter((rating) => rating.userId !== session.user.id)
      : book.ratings.filter((rating) => rating.deletedAt === null),
    userRating: session?.user?.id
      ? book.ratings.find((rating) => rating.userId === session.user.id)
      : undefined,
    rate: avgRate,
    readingStatus,
  }

  return res.json({ book: bookWithDetails })
}
