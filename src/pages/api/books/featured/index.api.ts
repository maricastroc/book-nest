import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const approvedBooks = await prisma.book.findMany({
      where: { status: 'APPROVED' },
      select: { id: true },
    })
    const approvedIds = approvedBooks.map((b) => b.id)

    if (approvedIds.length === 0) {
      return res.status(200).json({ featured: null })
    }

    const stats = await prisma.rating.groupBy({
      by: ['bookId'],
      where: { bookId: { in: approvedIds }, deletedAt: null },
      _avg: { rate: true },
      _count: { rate: true },
    })

    const ranked = stats
      .filter((s) => (s._count.rate ?? 0) >= 1)
      .sort(
        (a, b) =>
          (b._avg.rate ?? 0) - (a._avg.rate ?? 0) ||
          (b._count.rate ?? 0) - (a._count.rate ?? 0),
      )

    if (ranked.length === 0) {
      return res.status(200).json({ featured: null })
    }

    const topBookIds = ranked.slice(0, 8).map((s) => s.bookId)

    const reviews = await prisma.rating.findMany({
      where: {
        bookId: { in: topBookIds },
        deletedAt: null,
        NOT: { description: '' },
      },
      include: {
        book: {
          select: { id: true, name: true, author: true, coverUrl: true },
        },
        user: true,
        votes: true,
      },
    })

    const voteScore = (r: (typeof reviews)[number]) =>
      r.votes.filter((v) => v.type === 'UP').length -
      r.votes.filter((v) => v.type === 'DOWN').length

    let featured = null

    for (const stat of ranked) {
      const candidates = reviews.filter((r) => r.bookId === stat.bookId)
      if (candidates.length === 0) continue

      candidates.sort(
        (a, b) =>
          voteScore(b) - voteScore(a) ||
          b.rate - a.rate ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      const review = candidates[0]
      featured = {
        ...review,
        votes: {
          up: review.votes.filter((v) => v.type === 'UP').length,
          down: review.votes.filter((v) => v.type === 'DOWN').length,
          userVote: null,
        },
        bookRate: stat._avg.rate ?? null,
        bookRatingCount: stat._count.rate ?? 0,
      }
      break
    }

    return res.status(200).json({ featured })
  } catch (error) {
    console.error('Error fetching featured book:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
