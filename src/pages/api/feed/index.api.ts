import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

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

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = String(session.user.id)
  const page = Math.max(1, Number(req.query.page) || 1)
  const perPage = 10
  const search = String(req.query.search || '').trim()

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    })

    const followingIds = following.map((f) => f.followingId)

    if (followingIds.length === 0) {
      return res
        .status(200)
        .json({ feed: { activities: [], totalPages: 0, followingIds: [] } })
    }

    const where = {
      userId: { in: followingIds },
      deletedAt: null,
      ...(search
        ? {
            OR: [
              {
                book: {
                  name: { contains: search, mode: 'insensitive' as const },
                },
              },
              {
                book: {
                  author: { contains: search, mode: 'insensitive' as const },
                },
              },
              {
                user: {
                  name: { contains: search, mode: 'insensitive' as const },
                },
              },
            ],
          }
        : {}),
    }

    const [total, ratings] = await Promise.all([
      prisma.rating.count({ where }),
      prisma.rating.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          book: {
            select: { id: true, name: true, author: true, coverUrl: true },
          },
          votes: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ])

    const activities = ratings.map((r) => {
      const upVotes = r.votes.filter((v) => v.type === 'UP').length
      const downVotes = r.votes.filter((v) => v.type === 'DOWN').length
      const userVote = r.votes.find((v) => v.userId === userId)?.type || null

      return {
        type: 'rating' as const,
        id: r.id,
        createdAt: r.createdAt,
        user: r.user,
        book: r.book,
        rate: r.rate,
        description: r.description,
        votes: { up: upVotes, down: downVotes, userVote },
      }
    })

    return res.status(200).json({
      feed: {
        activities,
        totalPages: Math.ceil(total / perPage),
        followingIds,
      },
    })
  } catch (error) {
    console.error('Error fetching feed:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
