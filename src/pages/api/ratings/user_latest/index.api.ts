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
      where: { userId, deletedAt: null, NOT: { OR: { description: '' } } },
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          select: {
            id: true,
            name: true,
            author: true,
            coverUrl: true,
            readingStatus: {
              where: { userId },
              select: { status: true },
            },
          },
        },
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    if (!userLastRating) {
      return res
        .status(404)
        .json({ message: 'No ratings found for this user.' })
    }

    const { book, user } = userLastRating
    const readingStatus = book.readingStatus?.[0]?.status ?? null

    return res.json({
      rating: {
        book: {
          id: book.id,
          name: book.name,
          author: book.author,
          coverUrl: book.coverUrl,
        },
        user: {
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        description: userLastRating.description,
        rate: userLastRating.rate,
        createdAt: userLastRating.createdAt,
        readingStatus,
      },
    })
  } catch (error) {
    console.error('Error fetching user last rating:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
