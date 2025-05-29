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
      },
      take: 5,
    })

    return res.status(200).json({ ratings })
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
