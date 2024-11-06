import { prisma } from '@/lib/prisma'
import { getMostFrequentString } from '@/utils/getMostFrequentString'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const userId = String(req.query.userId)
  let searchQuery

  if (req.query.search) {
    searchQuery = String(req.query.search).toLowerCase()
  }

  const profile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      ratings: {
        where: searchQuery
          ? {
              OR: [
                {
                  book: {
                    name: {
                      contains: searchQuery,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  book: {
                    author: {
                      contains: searchQuery,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            }
          : {}, // Se searchQuery estiver vazio, não aplica filtro
        include: {
          book: {
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!profile) {
    return res.status(404).json({ message: 'User does not exist.' })
  }

  const readPages = profile.ratings.reduce(
    (acc, rating) => acc + rating.book.totalPages,
    0,
  )
  const ratedBooks = profile.ratings.length

  const authorsCount = profile.ratings.reduce((acc, rating) => {
    if (!acc.includes(rating.book.author)) {
      acc.push(rating.book.author)
    }
    return acc
  }, [] as string[])

  const categories = profile.ratings?.flatMap((rating) =>
    rating?.book?.categories?.flatMap((category) => category?.category?.name),
  )

  const bestGenre = categories ? getMostFrequentString(categories) : null

  const profileData = {
    user: {
      avatarUrl: profile.avatarUrl,
      name: profile.name,
      email: profile.email,
      createdAt: profile.createdAt,
    },
    ratings: profile.ratings,
    readPages,
    ratedBooks,
    authorsCount: authorsCount?.length,
    bestGenre,
  }

  return res.json({ profile: profileData })
}
