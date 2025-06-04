import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const bookId = String(req.query.bookId)

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' })
    }

    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const userRating = await prisma.rating.findFirst({
      where: {
        bookId,
        userId: String(session.user.id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        book: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return res.status(200).json({
      data: userRating || null,
    })
  } catch (error) {
    console.error('Error fetching user rating:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
