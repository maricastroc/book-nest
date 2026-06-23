import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'
import {
  Book,
  CategoriesOnBooks,
  Category,
  Rating,
  ReadingStatus,
} from '@prisma/client'

const MIN_RATE_FOR_RECOMMENDATION = 4
const MAX_RECOMMENDATIONS = 4

type RatingWithBookCategories = Rating & {
  book: Book & {
    categories: CategoriesOnBooks[]
  }
}

type BookWithRelations = Book & {
  categories: (CategoriesOnBooks & { category: Category })[]
  ratings: Pick<Rating, 'rate'>[]
  readingStatus: Pick<ReadingStatus, 'status'>[]
}

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

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'You must be logged in.' })
  }

  const userId = String(session.user.id)

  const userRatings = (await prisma.rating.findMany({
    where: { userId, deletedAt: null },
    include: {
      book: {
        include: {
          categories: true,
        },
      },
    },
  })) as RatingWithBookCategories[]

  const highRatedRatings = userRatings.filter(
    (r) => r.rate >= MIN_RATE_FOR_RECOMMENDATION,
  )

  if (highRatedRatings.length === 0) {
    return res.json({ recommended: { books: [], hasEnoughData: false } })
  }

  const ratedBookIds = userRatings.map((r) => r.bookId)

  const categoryIds = Array.from(
    new Set(
      highRatedRatings.flatMap((r) =>
        r.book.categories.map((c) => c.categoryId),
      ),
    ),
  )

  const candidateBooks = (await prisma.book.findMany({
    where: {
      status: 'APPROVED',
      id: { notIn: ratedBookIds },
      categories: {
        some: { categoryId: { in: categoryIds } },
      },
    },
    include: {
      categories: {
        include: { category: true },
      },
      ratings: {
        where: { deletedAt: null },
        select: { rate: true },
      },
      readingStatus: {
        where: { userId },
        select: { status: true },
      },
    },
  })) as BookWithRelations[]

  const booksWithScore = candidateBooks.map((book) => {
    const ratingCount = book.ratings.length
    const avgRate =
      ratingCount > 0
        ? book.ratings.reduce((sum, r) => sum + r.rate, 0) / ratingCount
        : 0

    const matchingCategories = book.categories.filter((c) =>
      categoryIds.includes(c.categoryId),
    ).length

    return {
      id: book.id,
      name: book.name,
      author: book.author,
      coverUrl: book.coverUrl,
      categories: book.categories.map((c) => c.category),
      rate: avgRate,
      ratingCount,
      readingStatus: book.readingStatus[0]?.status ?? null,
      _score: avgRate * 0.7 + matchingCategories * 0.3,
    }
  })

  booksWithScore.sort((a, b) => b._score - a._score)

  const recommendations = booksWithScore
    .slice(0, MAX_RECOMMENDATIONS)
    .map((book) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _score, ...rest } = book
      return rest
    })

  return res.json({
    recommended: { books: recommendations, hasEnoughData: true },
  })
}
