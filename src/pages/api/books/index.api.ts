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

  const page = Number(req.query.page)
  const perPage = Number(req.query.perPage)
  const validPage = !isNaN(page) && page > 0 ? page : 1
  const validPerPage = !isNaN(perPage) && perPage > 0 ? perPage : 12
  const skip = (validPage - 1) * validPerPage

  const SORTS = [
    'title-asc',
    'title-desc',
    'newest',
    'rating',
    'most-rated',
  ] as const
  type Sort = (typeof SORTS)[number]
  const sort: Sort = SORTS.includes(req.query.sort as Sort)
    ? (req.query.sort as Sort)
    : 'title-asc'

  const where = {
    categories: categoriesQuery,
    status: 'APPROVED' as const,
    ...(searchQuery && {
      OR: [
        { name: { contains: searchQuery, mode: 'insensitive' as const } },
        { author: { contains: searchQuery, mode: 'insensitive' as const } },
      ],
    }),
  }

  const books = await prisma.book.findMany({
    where,
    select: {
      id: true,
      name: true,
      author: true,
      coverUrl: true,
      createdAt: true,
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

  const rateValue = (book: (typeof booksWithDetails)[number]) =>
    Number.isNaN(book.rate) ? -1 : book.rate

  const sorters: Record<
    Sort,
    (
      a: (typeof booksWithDetails)[number],
      b: (typeof booksWithDetails)[number],
    ) => number
  > = {
    'title-asc': (a, b) => a.name.localeCompare(b.name),
    'title-desc': (a, b) => b.name.localeCompare(a.name),
    newest: (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    rating: (a, b) =>
      rateValue(b) - rateValue(a) ||
      b.ratingCount - a.ratingCount ||
      a.name.localeCompare(b.name),
    'most-rated': (a, b) =>
      b.ratingCount - a.ratingCount ||
      rateValue(b) - rateValue(a) ||
      a.name.localeCompare(b.name),
  }

  const sortedBooks = booksWithDetails.sort(sorters[sort])
  const total = sortedBooks.length
  const paginatedBooks = sortedBooks.slice(skip, skip + validPerPage)

  return res.json({
    data: {
      books: paginatedBooks,
      pagination: {
        page: validPage,
        perPage: validPerPage,
        total,
        totalPages: Math.ceil(total / validPerPage),
      },
    },
  })
}
