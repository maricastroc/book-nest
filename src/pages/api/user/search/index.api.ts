import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )
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

    const loggedUserId = session?.user?.id ? String(session.user.id) : null

    const followedIds = loggedUserId
      ? new Set(
          (
            await prisma.follow.findMany({
              where: {
                followerId: loggedUserId,
                followingId: { in: users.map((user) => user.id) },
              },
              select: { followingId: true },
            })
          ).map((follow) => follow.followingId),
        )
      : new Set<string>()

    const usersWithFollowStatus = users.map((user) => ({
      ...user,
      isFollowing: followedIds.has(user.id),
    }))

    return res.status(200).json({
      data: {
        users: usersWithFollowStatus,
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
