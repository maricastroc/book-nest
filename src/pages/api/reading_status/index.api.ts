import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { userId, bookId } = req.query

    if (!userId || !bookId) {
      return res.status(400).json({ message: 'UserId and BookId are required' })
    }

    const readingStatus = await prisma.readingStatus.findUnique({
      where: {
        userId_bookId: {
          userId: String(userId),
          bookId: String(bookId),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            email: true,
            createdAt: true,
          },
        },
        book: {
          select: {
            id: true,
            name: true,
            author: true,
            coverUrl: true,
          },
        },
      },
    })

    if (!readingStatus) {
      return res.status(404).json({ message: 'Reading status not found' })
    }

    const responseData = {
      readingStatus: readingStatus.status,
      book: {
        id: readingStatus.book.id,
        name: readingStatus.book.name,
        author: readingStatus.book.author,
        coverUrl: readingStatus.book.coverUrl,
      },
      user: {
        id: readingStatus.user.id,
        name: readingStatus.user.name,
        avatarUrl: readingStatus.user.avatarUrl,
        email: readingStatus.user.email,
        createdAt: readingStatus.user.createdAt,
      },
    }

    return res.status(200).json({ data: responseData })
  } else if (req.method === 'POST' || req.method === 'PUT') {
    const { userId, bookId, status } = req.body

    if (!userId || !bookId || !status) {
      return res
        .status(400)
        .json({ message: 'UserId, BookId, and Status are required.' })
    }

    const isPublicRating = ['read', 'didNotFinish'].includes(status)

    await prisma.rating.updateMany({
      where: {
        userId,
        bookId,
      },
      data: {
        deletedAt: isPublicRating ? null : new Date(),
      },
    })

    const updatedStatus = await prisma.readingStatus.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        status,
      },
      create: {
        userId,
        bookId,
        status,
      },
    })

    return res.status(200).json(updatedStatus)
  } else if (req.method === 'DELETE') {
    const { userId, bookId } = req.body

    if (!userId || !bookId) {
      return res
        .status(400)
        .json({ message: 'UserId and BookId are required.' })
    }

    await prisma.readingStatus.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    })

    return res
      .status(200)
      .json({ message: 'Reading status deleted successfully!' })
  } else {
    return res.status(405).end()
  }
}
