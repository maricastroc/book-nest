import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

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
        deletedAt: null,
        NOT: { description: '' },
        ...(userId
          ? {
              userId: { not: userId },
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        book: {
          select: {
            id: true,
            name: true,
            author: true,
            coverUrl: true,
          },
        },
        user: true,
        votes: true,
      },
      take: 5,
    })

    const ratingsWithGroupedVotes = ratings.map((rating) => {
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

    return res.status(200).json({ ratings: ratingsWithGroupedVotes })
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
