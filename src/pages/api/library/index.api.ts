import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { userId, category, search } = req.query

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
      categories: categoriesQuery,
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { author: { contains: searchQuery, mode: 'insensitive' } },
            ],
          }
        : {}),
      readingStatus: {
        some: { userId: String(userId) },
      },
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

  // Ajusta a estrutura de books com suas categorias e cálculos de média
  const booksWithCategories = books.map((book) => {
    const avgRate =
      book.ratings.reduce((sum, rating) => sum + rating.rate, 0) /
        book.ratings.length || 0

    // Encontra a avaliação do usuário específico
    const userRating =
      book.ratings.find((rating) => rating.userId === String(userId))?.rate ||
      null

    const categories = book.categories.map((cat) => cat.category)

    return {
      ...book,
      categories,
      rate: avgRate, // Média de avaliação de todos os usuários
      userRating, // Avaliação do usuário específico
      ratings: book.ratings,
      readingStatus: book.readingStatus[0]?.status || undefined,
    }
  })

  function toSnakeCase(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '_')
  }

  const booksByStatus = booksWithCategories.reduce((acc, book) => {
    const status = book.readingStatus
      ? toSnakeCase(book.readingStatus)
      : 'unknown'

    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(book)
    return acc
  }, {} as { [status: string]: typeof booksWithCategories })

  return res.json({ booksByStatus })
}
