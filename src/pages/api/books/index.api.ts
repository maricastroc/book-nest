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

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  const books = await prisma.book.findMany({
    where: {
      categories: categoriesQuery,
      ...(searchQuery
        ? {
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
          }
        : {}),
    },
    include: {
      ratings: {
        include: {
          user: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      ...(session
        ? {
            readingStatus: {
              where: {
                userId: String(session?.user?.id),
              },
            },
          }
        : {}),
    },
  })

  const booksFixedRelationWithCategory = books.map((book) => {
    return {
      ...book,
      categories: book.categories.map((category) => category.category),
    }
  })

  const booksAvgRating = await prisma.rating.groupBy({
    by: ['bookId'],
    where: {
      bookId: {
        in: books.map((book) => book.id),
      },
    },
    _avg: {
      rate: true,
    },
  })

  if (session) {
    const userBooks = await prisma.book.findMany({
      where: {
        ratings: {
          some: {
            userId: String(session?.user?.id),
          },
        },
      },
    })

    userBooks?.map((book) => book?.id)
  }

  const booksWithDetails = booksFixedRelationWithCategory.map((book) => {
    const bookAvgRating = booksAvgRating.find(
      (avgRating) => avgRating.bookId === book.id,
    )
    const avgRate = bookAvgRating?._avg.rate ?? NaN

    function toSnakeCase(text: string): string {
      return text.toLowerCase().replace(/\s+/g, '_')
    }

    const readingStatus = book.readingStatus?.[0]?.status
      ? toSnakeCase(book.readingStatus[0].status)
      : null

    return {
      ...book,
      ratings: book.ratings,
      rate: avgRate,
      readingStatus,
    }
  })

  return res.json({ books: booksWithDetails })
}
