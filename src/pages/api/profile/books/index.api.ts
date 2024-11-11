import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

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

  if (!session) {
    return res.status(401).end()
  }

  const userId = session?.user.id

  const { category, search } = req.query

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' })
  }

  let categoriesQuery
  if (category) {
    categoriesQuery = {
      some: {
        categoryId: String(category),
      },
    }
  }

  let searchQuery

  if (search) {
    searchQuery = String(search).toLowerCase()
  }

  const books = await prisma.book.findMany({
    where: {
      userId: String(userId),
      categories: categoriesQuery,
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { author: { contains: searchQuery, mode: 'insensitive' } },
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
      readingStatus: {
        where: { userId: String(userId) },
      },
    },
  })

  function toSnakeCase(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '_')
  }

  const booksWithCategories = books.map((book) => {
    const avgRate =
      book.ratings.length > 0
        ? book.ratings.reduce((sum, rating) => sum + rating.rate, 0) /
          book.ratings.length
        : 0

    const userRating =
      book.ratings.find((rating) => rating.userId === String(userId))?.rate ||
      null

    const categories = book.categories.map((cat) => cat.category)

    const formattedReadingStatus = book.readingStatus?.[0]?.status
      ? toSnakeCase(book.readingStatus[0].status)
      : null

    return {
      ...book,
      categories,
      rate: avgRate,
      userRating,
      readingStatus: formattedReadingStatus,
    }
  })

  return res.json({ books: booksWithCategories })
}
