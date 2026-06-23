import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

const DEFAULT_PAGE_SIZE = 10

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const userId = String(req.query.userId)

  const searchQuery = req.query.search
    ? String(req.query.search).toLowerCase()
    : undefined

  const page = Number(req.query.page) || 1
  const perPage = Number(req.query.perPage) || DEFAULT_PAGE_SIZE

  const searchWhere = searchQuery
    ? {
        OR: [
          {
            book: {
              name: { contains: searchQuery, mode: 'insensitive' as const },
            },
          },
          {
            book: {
              author: { contains: searchQuery, mode: 'insensitive' as const },
            },
          },
        ],
      }
    : undefined

  const [totalRatings, userRatings] = await Promise.all([
    prisma.rating.count({ where: { userId, ...searchWhere } }),

    prisma.rating.findMany({
      where: { userId, ...searchWhere },
      include: {
        book: {
          include: {
            categories: { include: { category: true } },
            readingStatus: { where: { userId } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ])

  const bookIds = userRatings.map((r) => r.bookId)

  const bookRatingStats = await prisma.rating.groupBy({
    by: ['bookId'],
    where: { bookId: { in: bookIds }, deletedAt: null },
    _avg: { rate: true },
    _count: { rate: true },
  })

  const totalPages = Math.ceil(totalRatings / perPage)

  const ratings = userRatings.map((rating) => {
    const stats = bookRatingStats.find((s) => s.bookId === rating.bookId)
    return {
      ...rating,
      book: {
        ...rating.book,
        readingStatus: rating.book.readingStatus[0]?.status ?? null,
        rate: stats?._avg.rate ?? NaN,
        ratingCount: stats?._count.rate ?? 0,
      },
    }
  })

  return res.json({
    data: {
      ratings,
      pagination: {
        currentPage: page,
        perPage,
        totalItems: totalRatings,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  })
}
