import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  let categoriesQuery
  let searchQuery

  if (req.query.category) {
    const categoryId = String(req.query.category)
    categoriesQuery = {
      some: {
        categoryId,
      },
    }
  }

  if (req.query.search) {
    searchQuery = String(req.query.search).toLowerCase()
  }

  const page = req.query.page ? Number(req.query.page) : 1
  const perPage = req.query.perPage ? Number(req.query.perPage) : 12
  const skip = (page - 1) * perPage

  const totalBooks = await prisma.book.count({
    where: {
      categories: categoriesQuery,
      ...(searchQuery && {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            author: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      }),
    },
  })

  const books = await prisma.book.findMany({
    where: {
      categories: categoriesQuery,
      ...(searchQuery && {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            author: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      }),
    },
    skip,
    take: perPage,
    select: {
      id: true,
      name: true,
      author: true,
      coverUrl: true,
      categories: {
        select: {
          category: true,
        },
      },
      ...(session && {
        readingStatus: {
          where: {
            userId: String(session?.user?.id),
          },
          select: {
            status: true,
          },
        },
      }),
    },
    orderBy: {
      name: 'asc',
    },
  })

  const booksRatingStats = await prisma.rating.groupBy({
    by: ['bookId'],
    where: {
      bookId: {
        in: books.map((book) => book.id),
      },
      deletedAt: null,
    },
    _avg: {
      rate: true,
    },
    _count: {
      rate: true,
    },
  })

  const booksWithDetails = books.map((book) => {
    const bookRatingStats = booksRatingStats.find(
      (stats) => stats.bookId === book.id,
    )

    const avgRate = bookRatingStats?._avg.rate ?? NaN
    const ratingCount = bookRatingStats?._count.rate ?? 0

    const readingStatus = book.readingStatus?.[0]?.status || null

    return {
      ...book,
      rate: avgRate,
      ratingCount,
      readingStatus,
      categories: book.categories.map((category) => category.category),
    }
  })

  return res.json({
    data: {
      books: booksWithDetails,
      pagination: {
        page,
        perPage,
        total: totalBooks,
        totalPages: Math.ceil(totalBooks / perPage),
      },
    },
  })
}
