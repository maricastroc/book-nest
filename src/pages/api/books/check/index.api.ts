/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
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
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    let { isbn, title } = req.query

    if (!isbn && !title) {
      return res.status(400).json({
        message: 'ISBN or title is required',
      })
    }

    if (isbn) {
      isbn = String(isbn).replace(/[-\s]/g, '')
    }

    const existingBook = await prisma.book.findFirst({
      where: {
        OR: [
          { isbn: isbn ? String(isbn) : undefined },
          {
            name: title
              ? {
                  equals: String(title),
                  mode: 'insensitive',
                }
              : undefined,
          },
        ].filter((condition) => condition !== undefined) as any,
      },
      select: {
        id: true,
        name: true,
        author: true,
        coverUrl: true,
        isbn: true,
      },
    })

    return res.status(200).json({
      exists: !!existingBook,
      book: existingBook || null,
    })
  } catch (error) {
    console.error('Book lookup error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
