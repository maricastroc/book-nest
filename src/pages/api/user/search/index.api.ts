import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' }) // Resposta adequada para métodos não permitidos
  }

  try {
    const searchQuery = req.query.search
      ? String(req.query.search).trim().toLowerCase()
      : ''

    const users = await prisma.user.findMany({
      where: searchQuery
        ? {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          }
        : undefined, // Retorna todos os usuários se nenhuma busca for feita
      select: {
        id: true,
        avatarUrl: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    return res.status(200).json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
