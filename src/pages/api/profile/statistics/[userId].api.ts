// /pages/api/profile/stats.ts
import { prisma } from '@/lib/prisma'
import { getMostFrequentString } from '@/utils/getMostFrequentString'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const userId = String(req.query.userId)

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) return res.status(404).json({ message: 'User not found.' })

  const readBooks = await prisma.book.findMany({
    where: {
      readingStatus: {
        some: {
          userId,
          status: { equals: 'read', mode: 'insensitive' },
        },
      },
    },
    include: {
      categories: { include: { category: true } },
    },
  })

  const readPages = readBooks.reduce((acc, book) => acc + book.totalPages, 0)
  const authorsCount = new Set(readBooks.map((book) => book.author)).size
  const categories = readBooks.flatMap((book) =>
    book.categories.map((c) => c.category.name),
  )
  const bestGenre = categories.length ? getMostFrequentString(categories) : null

  const ratingsCount = await prisma.rating.count({ where: { userId } })

  return res.json({
    readPages,
    authorsCount,
    bestGenre,
    ratedBooks: ratingsCount,
    user: {
      avatarUrl: user?.avatarUrl,
      name: user?.name,
      createdAt: user?.createdAt,
    },
  })
}
