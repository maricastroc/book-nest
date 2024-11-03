import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const books = await prisma.book.findMany({
    orderBy: {
      ratings: {
        _count: 'desc',
      },
    },
    include: {
      ratings: {
        include: {
          user: true, // Inclui os detalhes do usuário associado ao rating
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
    take: 4,
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

  let userBooksId: string[] = []

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
            userId: String(session.user.id),
          },
        },
      },
    })

    userBooksId = userBooks.map((book) => book.id)
  }

  const booksWithAvgRating = booksFixedRelationWithCategory.map((book) => {
    const bookAvgRating = booksAvgRating.find(
      (avgRating) => avgRating.bookId === book.id,
    )
    const { ...bookInfo } = book
    return {
      ...bookInfo,
      ratings: book.ratings, // Todos os atributos dos ratings são mantidos
      rate: bookAvgRating?._avg.rate,
      alreadyRead: userBooksId.includes(book.id),
    }
  })

  return res.json({ books: booksWithAvgRating })
}
