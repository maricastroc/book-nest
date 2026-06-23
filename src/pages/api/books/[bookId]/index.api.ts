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

  const userId = session?.user?.id ? String(session.user.id) : null

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: {
      id: true,
      name: true,
      author: true,
      summary: true,
      coverUrl: true,
      totalPages: true,
      publishingYear: true,
      publisher: true,
      language: true,
      isbn: true,
      status: true,
      createdAt: true,
      userId: true,
      categories: { include: { category: true } },
      user: { select: { avatarUrl: true, id: true, name: true } },
      ...(userId ? { readingStatus: { where: { userId } } } : {}),
    },
  })

  if (!book) {
    return res.status(400).json({ message: 'Book does not exist.' })
  }

  const [avgRateResult, otherRatings, userRating] = await Promise.all([
    prisma.rating.groupBy({
      by: ['bookId'],
      where: { bookId, deletedAt: null },
      _avg: { rate: true },
    }),

    prisma.rating.findMany({
      where: {
        bookId,
        deletedAt: null,
        ...(userId ? { userId: { not: userId } } : {}),
      },
      include: {
        user: true,
        votes: true,
      },
      orderBy: { createdAt: 'desc' },
    }),

    userId
      ? prisma.rating.findFirst({
          where: { bookId, userId, deletedAt: null },
          include: { user: true, votes: true },
        })
      : Promise.resolve(null),
  ])

  const avgRate = avgRateResult.length > 0 ? avgRateResult[0]._avg.rate : NaN

  const groupVotes = (rating: (typeof otherRatings)[number]) => {
    const upVotes = rating.votes.filter((v) => v.type === 'UP').length
    const downVotes = rating.votes.filter((v) => v.type === 'DOWN').length
    const userVote = userId
      ? rating.votes.find((v) => v.userId === userId)?.type ?? null
      : null
    return { ...rating, votes: { up: upVotes, down: downVotes, userVote } }
  }

  const bookWithDetails = {
    ...book,
    categories: book.categories.map((c) => c.category),
    ratings: otherRatings.map(groupVotes),
    userRating: userRating ? groupVotes(userRating) : undefined,
    rate: avgRate,
    readingStatus:
      'readingStatus' in book
        ? (book.readingStatus as { status: string }[])[0]?.status ?? null
        : null,
  }

  return res.json({ book: bookWithDetails })
}
