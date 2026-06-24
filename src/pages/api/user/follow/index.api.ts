import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
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

  const followerId = String(session.user.id)
  const followingId = req.body?.followingId
    ? String(req.body.followingId)
    : null

  if (!followingId) {
    return res.status(400).json({ message: 'followingId is required' })
  }

  if (followerId === followingId) {
    return res.status(400).json({ message: 'Cannot follow yourself' })
  }

  try {
    if (req.method === 'POST') {
      const follow = await prisma.follow.upsert({
        where: { followerId_followingId: { followerId, followingId } },
        create: { followerId, followingId },
        update: {},
      })
      return res.status(200).json({ follow })
    }

    await prisma.follow.deleteMany({
      where: { followerId, followingId },
    })

    return res.status(200).json({ message: 'Unfollowed' })
  } catch (error) {
    console.error('Error toggling follow:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
