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

  const booksWithRatingsAndStatus = await prisma.book.findMany({
    include: {
      ratings: {
        select: {
          rate: true,
        },
      },
      readingStatus: {
        where: {
          userId: String(session?.user?.id),
        },
        select: {
          status: true,
        },
      },
    },
    orderBy: {
      ratings: {
        _count: 'desc',
      },
    },
  })

  const booksWithDetails = booksWithRatingsAndStatus.map((book) => {
    const ratingCount = book.ratings.length

    const avgRating =
      ratingCount > 0
        ? book.ratings.reduce((sum, rating) => sum + rating.rate, 0) /
          ratingCount
        : 0

    const readingStatus = book.readingStatus?.[0]?.status || null

    return {
      ...book,
      ratingCount,
      rate: avgRating,
      readingStatus,
    }
  })

  const top6Books = booksWithDetails.slice(0, 6)

  return res.json({ books: top6Books })
}
