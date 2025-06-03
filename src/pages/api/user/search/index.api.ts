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

    const page = Number(req.query.page)
    const perPage = Number(req.query.perPage)

    const validPage = !isNaN(page) && page > 0 ? page : 1
    const validPerPage = !isNaN(perPage) && perPage > 0 ? perPage : 12

    const skip = (validPage - 1) * validPerPage

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

    const totalPages = Math.ceil(totalUsers / validPerPage)

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
      take: validPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({
      data: {
        users,
        pagination: {
          page: validPage,
          perPage: validPerPage,
          total: totalUsers,
          totalPages,
          hasNextPage: validPage < totalPages,
          hasPreviousPage: validPage > 1,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
