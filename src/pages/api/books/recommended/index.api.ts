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
import {
  buildCategoryAffinity,
  rankRecommendations,
  MAX_RATING,
  type CandidateBook,
} from '@/lib/recommendation/score'

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

  // A distribution over the categories the user has demonstrably enjoyed.
  const affinity = buildCategoryAffinity(
    highRatedRatings.map((r) => r.book.categories.map((c) => c.categoryId)),
  )
  const categoryIds = Array.from(affinity.keys())

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

  // Global mean rating across all live ratings — the Bayesian prior's target.
  const globalAgg = await prisma.rating.aggregate({
    where: { deletedAt: null },
    _avg: { rate: true },
  })
  const globalMean = globalAgg._avg.rate ?? MAX_RATING / 2

  const categoryNames = new Map<string, string>()
  for (const book of candidateBooks) {
    for (const c of book.categories) {
      categoryNames.set(c.categoryId, c.category.name)
    }
  }

  const candidates: CandidateBook[] = candidateBooks.map((book) => ({
    id: book.id,
    categoryIds: book.categories.map((c) => c.categoryId),
    rates: book.ratings.map((r) => r.rate),
  }))

  const ranked = rankRecommendations({
    candidates,
    affinity,
    globalMean,
    categoryNames,
    limit: MAX_RECOMMENDATIONS,
  })

  const booksById = new Map(candidateBooks.map((book) => [book.id, book]))

  const books = ranked.map((scored) => {
    const book = booksById.get(scored.id) as BookWithRelations
    const ratingCount = book.ratings.length
    const avgRate =
      ratingCount > 0
        ? book.ratings.reduce((sum, r) => sum + r.rate, 0) / ratingCount
        : 0

    return {
      id: book.id,
      name: book.name,
      author: book.author,
      coverUrl: book.coverUrl,
      categories: book.categories.map((c) => c.category),
      rate: avgRate,
      ratingCount,
      readingStatus: book.readingStatus[0]?.status ?? null,
      recommendation: {
        score: scored.score,
        bayesianRate: scored.bayesianRate,
        reasons: scored.reasons,
      },
    }
  })

  return res.json({
    recommended: { books, hasEnoughData: true },
  })
}
