import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  if (session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied' })
  }

  const { bookId, status } = req.body

  if (!bookId) {
    return res.status(400).json({ message: 'Book ID is required' })
  }

  if (!['REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  try {
    const updatedBook = await prisma.book.update({
      where: { id: String(bookId) },
      data: { status },
    })

    return res
      .status(200)
      .json({ book: updatedBook, message: 'Book successfully rejected!' })
  } catch (err) {
    return res.status(500).json({ message: 'Error updating book status' })
  }
}
