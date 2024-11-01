import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const bookId = String(req.query.bookId)

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      ratings: {
        include: {
          user: true,
        },
      },
    },
  })

  return res.json({ book })
}
