import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' })
    }

    const readingStatuses = await prisma.readingStatus.findMany({
      where: { userId: String(userId) },
      include: {
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

    return res.status(200).json(readingStatuses)
  } else if (req.method === 'POST') {
    const { userId, bookId, status } = req.body

    if (!userId || !bookId || !status) {
      return res
        .status(400)
        .json({ message: 'UserId, BookId, and Status are required.' })
    }

    // Verifica se o status já existe
    const existingStatus = await prisma.readingStatus.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    })

    if (existingStatus) {
      return res
        .status(409)
        .json({ message: 'Reading status already exists for this book.' })
    }

    const newReadingStatus = await prisma.readingStatus.create({
      data: {
        userId,
        bookId,
        status,
      },
    })

    return res.status(201).json(newReadingStatus)
  } else if (req.method === 'PUT') {
    const { userId, bookId, status } = req.body

    if (!userId || !bookId || !status) {
      return res
        .status(400)
        .json({ message: 'UserId, BookId, and Status are required.' })
    }

    const updatedStatus = await prisma.readingStatus.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        status, // Atualiza o status de leitura
      },
      create: {
        userId,
        bookId,
        status, // Cria um novo status de leitura
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
