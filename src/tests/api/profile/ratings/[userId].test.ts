import { mockReq, mockRes } from '@/tests/utils/http-mocks'
import handler from '@/pages/api/profile/ratings/[userId].api'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    rating: {
      count: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}))

describe('GET /api/profile/ratings/[userId]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 405 if method is not GET', async () => {
    const req = mockReq({ method: 'POST' })
    const json = jest.fn()
    const end = jest.fn()
    const status = jest.fn(() => ({ json, end }))
    const res = mockRes({ json, status })

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
    expect(end).toHaveBeenCalled()
  })

  it('returns paginated ratings with pagination info', async () => {
    const userId = 'user-123'
    const page = 2
    const perPage = 2
    const totalRatings = 5

    const mockRatings = [
      {
        id: 'rating-1',
        bookId: 'book-1',
        createdAt: new Date().toISOString(),
        book: {
          id: 'book-1',
          name: 'Book One',
          author: 'Author One',
          categories: [{ category: { id: 'cat-1', name: 'Fiction' } }],
          readingStatus: [{ status: 'READ' }],
        },
      },
      {
        id: 'rating-2',
        bookId: 'book-2',
        createdAt: new Date().toISOString(),
        book: {
          id: 'book-2',
          name: 'Book Two',
          author: 'Author Two',
          categories: [{ category: { id: 'cat-2', name: 'Sci-Fi' } }],
          readingStatus: [{ status: 'READING' }],
        },
      },
    ]

    ;(prisma.rating.count as jest.Mock).mockResolvedValue(totalRatings)
    ;(prisma.rating.findMany as jest.Mock).mockResolvedValue(mockRatings)
    ;(prisma.rating.groupBy as jest.Mock).mockResolvedValue([
      { bookId: 'book-1', _avg: { rate: 4 }, _count: { rate: 3 } },
      { bookId: 'book-2', _avg: { rate: 3 }, _count: { rate: 1 } },
    ])

    const req = mockReq({
      method: 'GET',
      query: { userId, page: String(page), perPage: String(perPage) },
    })

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = mockRes({ json, status })

    await handler(req, res)

    expect(prisma.rating.count).toHaveBeenCalledWith({ where: { userId } })
    expect(prisma.rating.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId } }),
    )

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

  it('applies search query to rating count and findMany', async () => {
    const userId = 'user-123'
    const search = 'search term'

    const mockRatings = [
      {
        id: 'rating-1',
        bookId: 'book-1',
        createdAt: new Date().toISOString(),
        book: {
          id: 'book-1',
          name: 'Book One',
          author: 'Author One',
          categories: [],
          readingStatus: [{ status: 'READ' }],
        },
      },
    ]

    ;(prisma.rating.count as jest.Mock).mockResolvedValue(1)
    ;(prisma.rating.findMany as jest.Mock).mockResolvedValue(mockRatings)
    ;(prisma.rating.groupBy as jest.Mock).mockResolvedValue([
      { bookId: 'book-1', _avg: { rate: 4 }, _count: { rate: 1 } },
    ])

    const req = mockReq({
      method: 'GET',
      query: { userId, search },
    })

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = mockRes({ json, status })

    await handler(req, res)

    const searchWhere = {
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
    }

    expect(prisma.rating.count).toHaveBeenCalledWith({
      where: { userId, ...searchWhere },
    })

    expect(prisma.rating.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId, ...searchWhere } }),
    )

    expect(json).toHaveBeenCalled()
  })
})
