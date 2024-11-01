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

  if (req.query.category) {
    const categoryId = String(req.query.category)
    categoriesQuery = {
      some: {
        categoryId,
      },
    }
  }

  const books = await prisma.book.findMany({
    where: {
      categories: categoriesQuery,
    },
    include: {
      ratings: {
        select: {
          rate: true,
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
      rate: avgRate,
      alreadyRead,
    }
  })

  return res.json({ booksWithRating })
}
