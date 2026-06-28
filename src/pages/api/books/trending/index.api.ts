import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

const WINDOW_DAYS = 7
const TAKE = 8

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000)

    const recent = await prisma.rating.groupBy({
      by: ['bookId'],
      where: { deletedAt: null, createdAt: { gte: since } },
      _count: { rate: true },
    })

    const trendingIds = recent
      .sort((a, b) => (b._count.rate ?? 0) - (a._count.rate ?? 0))
      .map((r) => r.bookId)

    let orderedIds = trendingIds.slice(0, TAKE)

    if (orderedIds.length < 4) {
      const popular = await prisma.book.findMany({
        where: { status: 'APPROVED' },
        take: TAKE,
        orderBy: { ratings: { _count: 'desc' } },
        select: { id: true },
      })
      const backfill = popular
        .map((b) => b.id)
        .filter((id) => !orderedIds.includes(id))
      orderedIds = [...orderedIds, ...backfill].slice(0, TAKE)
    }

    if (orderedIds.length === 0) {
      return res.status(200).json({ books: [] })
    }

    const found = await prisma.book.findMany({
      where: { id: { in: orderedIds }, status: 'APPROVED' },
      select: {
        id: true,
        name: true,
        author: true,
        coverUrl: true,
        categories: { select: { category: true } },
      },
    })

    const ratingStats = await prisma.rating.groupBy({
      by: ['bookId'],
      where: { bookId: { in: orderedIds }, deletedAt: null },
      _avg: { rate: true },
      _count: { rate: true },
    })

    const books = orderedIds
      .map((id) => found.find((b) => b.id === id))
      .filter((b): b is (typeof found)[number] => Boolean(b))
      .map((book) => {
        const stats = ratingStats.find((s) => s.bookId === book.id)
        return {
          ...book,
          categories: book.categories.map((c) => c.category),
          rate: stats?._avg.rate ?? NaN,
          ratingCount: stats?._count.rate ?? 0,
          readingStatus: null,
        }
      })

    return res.status(200).json({ books })
  } catch (error) {
    console.error('Error fetching trending books:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
