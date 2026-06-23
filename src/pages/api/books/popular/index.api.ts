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

  const userId = session?.user?.id ? String(session.user.id) : null

  const top6Books = await prisma.book.findMany({
    where: { status: 'APPROVED' },
    take: 6,
    orderBy: { ratings: { _count: 'desc' } },
    select: {
      id: true,
      name: true,
      author: true,
      coverUrl: true,
      categories: { select: { category: true } },
      ...(userId
        ? {
            readingStatus: {
              where: { userId },
              select: { status: true },
            },
          }
        : {}),
    },
  })

  const bookIds = top6Books.map((b) => b.id)

  const ratingStats = await prisma.rating.groupBy({
    by: ['bookId'],
    where: { bookId: { in: bookIds }, deletedAt: null },
    _avg: { rate: true },
    _count: { rate: true },
  })

  const books = top6Books.map((book) => {
    const stats = ratingStats.find((s) => s.bookId === book.id)
    return {
      ...book,
      categories: book.categories.map((c) => c.category),
      rate: stats?._avg.rate ?? NaN,
      ratingCount: stats?._count.rate ?? 0,
      readingStatus:
        'readingStatus' in book
          ? (book.readingStatus as { status: string }[])[0]?.status ?? null
          : null,
    }
  })

  return res.json({ books })
}
