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

  const statusGroups = await prisma.readingStatus.groupBy({
    by: ['status'],
    where: { userId },
    _count: { status: true },
  })

  const statusCounts = { read: 0, reading: 0, wantToRead: 0, didNotFinish: 0 }

  const STATUS_KEY_MAP: Record<string, keyof typeof statusCounts> = {
    read: 'read',
    reading: 'reading',
    'want to read': 'wantToRead',
    'did not finish': 'didNotFinish',
  }

  for (const group of statusGroups) {
    const key = STATUS_KEY_MAP[group.status.toLowerCase()]
    if (key) {
      statusCounts[key] = group._count.status
    }
  }

  const booksCount = Object.values(statusCounts).reduce((a, b) => a + b, 0)

  return res.json({
    readPages,
    authorsCount,
    bestGenre,
    ratedBooks: ratingsCount,
    booksCount,
    statusCounts,
    user: {
      avatarUrl: user?.avatarUrl,
      name: user?.name,
      createdAt: user?.createdAt,
    },
  })
}
