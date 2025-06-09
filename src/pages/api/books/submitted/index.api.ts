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
    return res.status(401).json({ message: 'Authentication required' })
  }

  const { page = '1', perPage = '20' } = req.query

  const pageNumber = Number(page)
  const itemsPerPage = Number(perPage)
  const skip = (pageNumber - 1) * itemsPerPage

  if (session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied' })
  }

  const totalBooks = await prisma.book.count({
    where: { status: 'PENDING' },
  })

  const pendingBooks = await prisma.book.findMany({
    where: { status: 'PENDING' },
    skip,
    take: itemsPerPage,
    select: {
      id: true,
      name: true,
      author: true,
      coverUrl: true,
      publisher: true,
      isbn: true,
      language: true,
      summary: true,
      totalPages: true,
      publishingYear: true,
      createdAt: true,
      _count: {
        select: { ratings: true },
      },
      categories: {
        include: {
          category: true,
        },
      },
      user: {
        select: {
          avatarUrl: true,
          name: true,
          id: true,
        },
      },
    },
  })

  const booksWithDetails = pendingBooks.map((book) => {
    return {
      ...book,
      categories: book.categories.map((category) => category.category),
    }
  })

  return res.json({
    data: {
      pendingBooks: booksWithDetails,
      pagination: {
        total: totalBooks,
        page: pageNumber,
        perPage: itemsPerPage,
        totalPages: Math.ceil(totalBooks / itemsPerPage),
      },
    },
  })
}
