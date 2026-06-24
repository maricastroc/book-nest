import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { userId } = req.query

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'userId is required' })
  }

  try {
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return res.status(200).json({ users: follows.map((f) => f.following) })
  } catch (error) {
    console.error('Error fetching following:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
