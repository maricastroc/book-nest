import { prisma } from '@/lib/prisma'
import { getMostFrequentString } from '@/utils/getMostFrequentString'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const userId = String(req.query.userId)
  const searchQuery = req.query.search
    ? String(req.query.search).toLowerCase()
    : undefined

  const profile = await prisma.user.findUnique({
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
              readingStatus: { where: { userId } }, // Status específico do usuário
              ratings: true, // Todas as avaliações do livro
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!profile) {
    return res.status(404).json({ message: 'User does not exist.' })
  }

  const readBooks = await prisma.book.findMany({
    where: {
      readingStatus: {
        some: {
          userId,
          status: { equals: 'read', mode: 'insensitive' },
        },
      },
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
      categories: { include: { category: true } },
      readingStatus: { where: { userId } }, // Status específico do usuário
      ratings: true, // Todas as avaliações do livro
    },
  })

  // Processamento dos dados (igual ao seu código atual)
  const readPages = readBooks.reduce((acc, book) => acc + book.totalPages, 0)
  const authorsCount = readBooks.reduce((acc, book) => {
    if (!acc.includes(book.author)) acc.push(book.author)
    return acc
  }, [] as string[]).length
  const categories = readBooks.flatMap((book) =>
    book.categories.map((cat) => cat.category.name),
  )
  const bestGenre = categories.length ? getMostFrequentString(categories) : null

  // Formatação das ratings para incluir o status simplificado
  const formattedRatings = profile.ratings.map((rating) => ({
    ...rating,
    book: {
      ...rating.book,
      readingStatus: rating.book.readingStatus[0]?.status || null, // Simplifica o status
      ratings: rating.book.ratings, // Mantém todas as avaliações
    },
  }))

  return res.json({
    profile: {
      user: {
        id: profile.id,
        avatarUrl: profile.avatarUrl,
        name: profile.name,
        email: profile.email,
        createdAt: profile.createdAt,
      },
      ratings: formattedRatings, // Ratings formatadas
      readPages,
      ratedBooks: profile.ratings.length,
      authorsCount,
      bestGenre,
      readBooks: readBooks.map((book) => ({
        ...book,
        readingStatus: book.readingStatus[0]?.status || null, // Status simplificado
      })),
    },
  })
}
