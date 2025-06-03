/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/profile/ratings/[userId].api'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    rating: {
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}))

describe('GET /api/profile/ratings/[userId]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 405 if method is not GET', async () => {
    const req = { method: 'POST' } as any
    const json = jest.fn()
    const end = jest.fn()
    const status = jest.fn(() => ({ json, end }))
    const res = { json, status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
    expect(end).toHaveBeenCalled()
  })

  it('returns 404 if user not found', async () => {
    ;(prisma.rating.count as jest.Mock).mockResolvedValue(0)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const req = {
      method: 'GET',
      query: { userId: 'non-existent' },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ message: 'User not found.' })
  })

  it('returns paginated ratings with pagination info', async () => {
    const userId = 'user-123'
    const page = 2
    const perPage = 2
    const totalRatings = 5

    ;(prisma.rating.count as jest.Mock).mockResolvedValue(totalRatings)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: userId,
      ratings: [
        {
          id: 'rating-1',
          createdAt: new Date().toISOString(),
          book: {
            id: 'book-1',
            name: 'Book One',
            author: 'Author One',
            categories: [{ category: { id: 'cat-1', name: 'Fiction' } }],
            readingStatus: [{ status: 'READ' }],
            ratings: [
              /* ... */
            ],
          },
        },
        {
          id: 'rating-2',
          createdAt: new Date().toISOString(),
          book: {
            id: 'book-2',
            name: 'Book Two',
            author: 'Author Two',
            categories: [{ category: { id: 'cat-2', name: 'Sci-Fi' } }],
            readingStatus: [{ status: 'READING' }],
            ratings: [
              /* ... */
            ],
          },
        },
      ],
    })

    const req = {
      method: 'GET',
      query: {
        userId,
        page: String(page),
        perPage: String(perPage),
      },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.rating.count).toHaveBeenCalledWith({
      where: { userId },
    })

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
      include: expect.any(Object),
    })

    expect(json).toHaveBeenCalledWith({
      data: {
        ratings: expect.arrayContaining([
          expect.objectContaining({
            id: 'rating-1',
            book: expect.objectContaining({
              id: 'book-1',
              readingStatus: 'READ',
            }),
          }),
          expect.objectContaining({
            id: 'rating-2',
            book: expect.objectContaining({
              id: 'book-2',
              readingStatus: 'READING',
            }),
          }),
        ]),
        pagination: {
          currentPage: page,
          perPage,
          totalItems: totalRatings,
          totalPages: Math.ceil(totalRatings / perPage),
          hasNextPage: page < Math.ceil(totalRatings / perPage),
          hasPreviousPage: page > 1,
        },
      },
    })
  })

  it('applies search query to rating count and user ratings', async () => {
    const userId = 'user-123'
    const search = 'search term'

    ;(prisma.rating.count as jest.Mock).mockResolvedValue(1)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: userId,
      ratings: [
        {
          id: 'rating-1',
          createdAt: new Date().toISOString(),
          book: {
            id: 'book-1',
            name: 'Book One',
            author: 'Author One',
            categories: [],
            readingStatus: [{ status: 'READ' }],
            ratings: [],
          },
        },
      ],
    })

    const req = {
      method: 'GET',
      query: {
        userId,
        search,
      },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.rating.count).toHaveBeenCalledWith({
      where: {
        userId,
        OR: [
          {
            book: {
              name: { contains: search.toLowerCase(), mode: 'insensitive' },
            },
          },
          {
            book: {
              author: { contains: search.toLowerCase(), mode: 'insensitive' },
            },
          },
        ],
      },
    })

    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: userId },
        include: expect.objectContaining({
          ratings: expect.objectContaining({
            where: expect.any(Object),
          }),
        }),
      }),
    )

    expect(json).toHaveBeenCalled()
  })
})
