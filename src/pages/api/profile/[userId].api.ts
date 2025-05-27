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

  // Busca o perfil + avaliações (com busca se houver)
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
              readingStatus: { where: { userId } },
              ratings: true,
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

  const allReadBooks = await prisma.book.findMany({
    where: {
      readingStatus: {
        some: {
          userId,
          status: { equals: 'read', mode: 'insensitive' },
        },
      },
    },
    include: {
      categories: { include: { category: true } },
      readingStatus: { where: { userId } },
      ratings: true,
    },
  })

  const readBooksToDisplay = searchQuery
    ? await prisma.book.findMany({
        where: {
          readingStatus: {
            some: {
              userId,
              status: { equals: 'read', mode: 'insensitive' },
            },
          },
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { author: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        include: {
          categories: { include: { category: true } },
          readingStatus: { where: { userId } },
          ratings: true,
        },
      })
    : allReadBooks

  // Estatísticas baseadas em todos os livros lidos
  const readPages = allReadBooks.reduce((acc, book) => acc + book.totalPages, 0)
  const authorsCount = allReadBooks.reduce((acc, book) => {
    if (!acc.includes(book.author)) acc.push(book.author)
    return acc
  }, [] as string[]).length
  const categories = allReadBooks.flatMap((book) =>
    book.categories.map((cat) => cat.category.name),
  )
  const bestGenre = categories.length ? getMostFrequentString(categories) : null

  const formattedRatings = profile.ratings.map((rating) => ({
    ...rating,
    book: {
      ...rating.book,
      readingStatus: rating.book.readingStatus[0]?.status || null,
      ratings: rating.book.ratings,
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
      ratings: formattedRatings,
      readPages,
      ratedBooks: profile.ratings.length,
      authorsCount,
      bestGenre,
      readBooks: readBooksToDisplay.map((book) => ({
        ...book,
        readingStatus: book.readingStatus[0]?.status || null,
      })),
    },
  })
}
