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
    searchQuery = String(req.query.search).toLowerCase() // Converte para minúsculas
  }

  const books = await prisma.book.findMany({
    where: {
      categories: categoriesQuery,
      ...(searchQuery
        ? {
            OR: [
              {
                name: {
                  contains: searchQuery,
                  mode: 'insensitive', // busca insensível a maiúsculas e minúsculas
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
        : {}), // Se searchQuery não estiver presente, não adiciona o filtro OR
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
    },
  })

  const booksFixedRelationWithCategory = books.map((book) => {
    return {
      ...book,
      categories: book.categories.map((category) => category.category),
    }
  })

  let userBooksIds: string[] = []

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

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

    userBooksIds = userBooks?.map((book) => book?.id)
  }

  const booksWithRating = booksFixedRelationWithCategory.map((book) => {
    let avgRate = NaN

    if (book.ratings.length > 0) {
      avgRate =
        book.ratings.reduce((sum, rateObj) => {
          return sum + rateObj.rate
        }, 0) / book.ratings.length
    }

    let alreadyRead = false

    if (userBooksIds.length > 0) {
      alreadyRead = userBooksIds.includes(book.id)
    }

    return {
      ...book,
      ratings: book.ratings,
      rate: avgRate,
      alreadyRead,
    }
  })

  return res.json({ booksWithRating })
}
