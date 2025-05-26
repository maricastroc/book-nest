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
        where: {
          ...(searchQuery && {
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
          }),
        },
        include: {
          book: {
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
              readingStatus: {
                where: {
                  userId,
                  status: {
                    equals: 'read',
                    mode: 'insensitive',
                  },
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

  const readBooks = await prisma.book.findMany({
    where: {
      readingStatus: {
        some: {
          userId,
          status: {
            equals: 'read',
            mode: 'insensitive',
          },
        },
      },
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { author: { contains: searchQuery, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  })

  if (!profile) {
    return res.status(404).json({ message: 'User does not exist.' })
  }

  const readPages = readBooks.reduce((acc, book) => acc + book.totalPages, 0)

  const authorsCount = readBooks.reduce((acc, book) => {
    if (!acc.includes(book.author)) {
      acc.push(book.author)
    }
    return acc
  }, [] as string[]).length

  const categories = readBooks.flatMap((book) =>
    book.categories.map((cat) => cat.category.name),
  )

  const bestGenre = categories.length ? getMostFrequentString(categories) : null

  const profileData = {
    user: {
      id: profile.id,
      avatarUrl: profile.avatarUrl,
      name: profile.name,
      email: profile.email,
      createdAt: profile.createdAt,
    },
    ratings: profile.ratings,
    readPages,
    ratedBooks: profile.ratings.length,
    authorsCount,
    bestGenre,
  }

  return res.json({ profile: profileData })
}
