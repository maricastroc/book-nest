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

  const totalRatings = await prisma.rating.count({
    where: {
      userId,
      ...(searchQuery && {
        OR: [
          { book: { name: { contains: searchQuery, mode: 'insensitive' } } },
          { book: { author: { contains: searchQuery, mode: 'insensitive' } } },
        ],
      }),
    },
  })

  const totalPages = Math.ceil(totalRatings / perPage)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      ratings: {
        where: searchQuery
          ? {
              OR: [
                {
                  book: {
                    name: { contains: searchQuery, mode: 'insensitive' },
                  },
                },
                {
                  book: {
                    author: { contains: searchQuery, mode: 'insensitive' },
                  },
                },
              ],
            }
          : undefined,
        include: {
          book: {
            include: {
              categories: { include: { category: true } },
              readingStatus: { where: { userId } },
              ratings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      },
    },
  })

  if (!user) return res.status(404).json({ message: 'User not found.' })

  return res.json({
    data: {
      ratings: user.ratings.map((rating) => ({
        ...rating,
        book: {
          ...rating.book,
          readingStatus: rating.book.readingStatus[0]?.status || null,
          ratings: rating.book.ratings,
        },
      })),
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
