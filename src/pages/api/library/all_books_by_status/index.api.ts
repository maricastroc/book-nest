import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { userId, status, page = '1', perPage = '10' } = req.query

  if (!userId || !status) {
    return res.status(400).json({ message: 'userId and status are required' })
  }

  let searchQuery

  if (req.query.search) {
    searchQuery = String(req.query.search).toLowerCase()
  }

  const pageNumber = Number(page)
  const itemsPerPage = Number(perPage)
  const skip = (pageNumber - 1) * itemsPerPage

  const whereCondition: Prisma.BookWhereInput = {
    status: 'APPROVED',
    readingStatus: {
      some: {
        userId: String(userId),
        status: {
          equals: status as string,
          mode: 'insensitive',
        },
      },
    },
    ...(searchQuery && {
      OR: [
        {
          name: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        {
          author: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
      ],
    }),
  }

  const totalBooks = await prisma.book.count({
    where: whereCondition,
  })

  const books = await prisma.book.findMany({
    where: whereCondition,
    skip,
    take: itemsPerPage,
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      author: true,
      coverUrl: true,
      readingStatus: {
        where: { userId: String(userId) },
        select: { status: true },
      },
      ratings: {
        where: { userId: String(userId) },
        select: { rate: true },
      },
    },
  })

  const booksWithDetails = books.map((book) => {
    const userRating = book.ratings.length > 0 ? book.ratings[0].rate : null
    const readingStatus = book.readingStatus[0]?.status || null

    return {
      id: book.id,
      name: book.name,
      author: book.author,
      coverUrl: book.coverUrl,
      userRating,
      readingStatus,
    }
  })

  return res.json({
    data: {
      books: booksWithDetails,
      pagination: {
        page: pageNumber,
        perPage: itemsPerPage,
        total: totalBooks,
        totalPages: Math.ceil(totalBooks / itemsPerPage),
      },
    },
  })
}
