import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { userId, page = '1', perPage = '20' } = req.query

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' })
  }

  const user = await prisma.user.findUnique({
    where: { id: String(userId) },
    select: { avatarUrl: true, name: true, id: true, createdAt: true },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const pageNumber = Number(page)
  const itemsPerPage = Number(perPage)
  const skip = (pageNumber - 1) * itemsPerPage

  const totalBooks = await prisma.book.count({
    where: { userId: String(userId) },
  })

  const submittedBooks = await prisma.book.findMany({
    where: { userId: String(userId), status: 'APPROVED' },
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
      categories: {
        include: {
          category: true,
        },
      },
    },
  })

  const submittedBooksWithDetails = submittedBooks.map((book) => {
    return {
      ...book,
      categories: book.categories.map((category) => category.category),
    }
  })

  return res.json({
    data: {
      user,
      submittedBooks: submittedBooksWithDetails,
      pagination: {
        total: totalBooks,
        page: pageNumber,
        perPage: itemsPerPage,
        totalPages: Math.ceil(totalBooks / itemsPerPage),
      },
    },
  })
}
