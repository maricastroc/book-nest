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

  const { userId } = req.query

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'userId is required' })
  }

  try {
    const [followersCount, followingCount, isFollowing] = await Promise.all([
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.follow.count({ where: { followerId: userId } }),
      session?.user?.id
        ? prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: String(session.user.id),
                followingId: userId,
              },
            },
          })
        : null,
    ])

    return res.status(200).json({
      followersCount,
      followingCount,
      isFollowing: !!isFollowing,
    })
  } catch (error) {
    console.error('Error fetching follow status:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
