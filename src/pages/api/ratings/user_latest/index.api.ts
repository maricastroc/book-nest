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

  if (!session)
    return res.status(401).end('Please login to access this API route.')

  const userLastRating = await prisma.rating.findFirst({
    where: {
      userId: String(session?.user?.id),
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      book: true,
    },
  })

  return res.json({ rating: userLastRating })
}
