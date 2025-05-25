import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const searchQuery = req.query.search
      ? String(req.query.search).trim().toLowerCase()
      : ''

    const page = req.query.page ? Math.max(1, Number(req.query.page)) : 1
    const perPage = req.query.perPage
      ? Math.max(1, Number(req.query.perPage))
      : 12
    const skip = (page - 1) * perPage

    const totalUsers = await prisma.user.count({
      where: searchQuery
        ? {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          }
        : undefined,
    })

    const totalPages = Math.ceil(totalUsers / perPage)

    const users = await prisma.user.findMany({
      where: searchQuery
        ? {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          }
        : undefined,
      select: {
        id: true,
        avatarUrl: true,
        name: true,
        email: true,
        createdAt: true,
      },
      skip,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({
      data: {
        users,
        pagination: {
          page,
          perPage,
          total: totalUsers,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
