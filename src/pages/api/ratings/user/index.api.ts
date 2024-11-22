import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const bookId = String(req.query.bookId)

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

    const userRating = await prisma.rating.findFirst({
      where: {
        userId,
        bookId,
      },
    })

    return res.json({ userRating })
  } catch (error) {
    console.error('Error fetching user last rating:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
