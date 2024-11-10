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

  // Buscando os livros que pertencem ao usuário logado
  const books = await prisma.book.findMany({
    where: {
      userId: String(userId), // Filtra os livros de acordo com o userId do livro
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
          user: true, // Inclui os usuários que deram rating
        },
      },
      categories: {
        include: {
          category: true, // Inclui as categorias associadas
        },
      },
      readingStatus: {
        where: { userId: String(userId) }, // Inclui o status de leitura do usuário logado
      },
    },
  })

  // Processando os livros para calcular a média de avaliações e incluir categorias
  const booksWithCategories = books.map((book) => {
    const avgRate =
      book.ratings.length > 0
        ? book.ratings.reduce((sum, rating) => sum + rating.rate, 0) /
          book.ratings.length
        : 0

    // Encontra a avaliação do usuário específico
    const userRating =
      book.ratings.find((rating) => rating.userId === String(userId))?.rate ||
      null

    const categories = book.categories.map((cat) => cat.category)

    return {
      ...book,
      categories,
      averageRate: avgRate, // Média das avaliações
      userRating, // Avaliação do usuário específico
      ratings: book.ratings,
      readingStatus: book.readingStatus[0]?.status || undefined, // Status de leitura do usuário
    }
  })

  return res.json({ books: booksWithCategories })
}
