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
          votes: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      user: {
        select: {
          avatarUrl: true,
          id: true,
          name: true,
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

  const ratingsWithGroupedVotes = book.ratings.map((rating) => {
    const upVotes = rating.votes.filter((v) => v.type === 'UP').length

    const downVotes = rating.votes.filter((v) => v.type === 'DOWN').length

    const userVote = session?.user?.id
      ? rating.votes.find((v) => v.userId === session.user.id)?.type || null
      : null

    return {
      ...rating,
      votes: {
        up: upVotes,
        down: downVotes,
        userVote,
      },
    }
  })

  const bookWithDetails = {
    ...book,
    categories: book.categories.map((category) => category.category),
    user: book.user,
    ratings: session?.user?.id
      ? ratingsWithGroupedVotes.filter(
          (rating) => rating.userId !== session.user.id,
        )
      : ratingsWithGroupedVotes.filter((rating) => rating.deletedAt === null),
    userRating: session?.user?.id
      ? ratingsWithGroupedVotes.find(
          (rating) => rating.userId === session.user.id,
        )
      : undefined,
    rate: avgRate,
    readingStatus,
  }

  return res.json({ book: bookWithDetails })
}
