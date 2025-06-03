/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/library/all_books_by_status/index.api'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

describe('GET /api/your-endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 405 if method is not GET', async () => {
    const req = { method: 'POST' } as any
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })

  it('returns 400 if userId or status are missing', async () => {
    const req = { method: 'GET', query: { userId: '123' } } as any
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status, json } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({
      message: 'userId and status are required',
    })
  })

  it('returns books data with pagination', async () => {
    const userId = 'user-123'
    const status = 'reading'
    const page = '2'
    const perPage = '5'
    const search = 'some search'

    const fakeCount = 12
    const fakeBooks = [
      {
        id: 'book-1',
        name: 'Book One',
        author: 'Author One',
        coverUrl: 'cover1.jpg',
        readingStatus: [{ status }],
        ratings: [{ rate: 4 }],
      },
      {
        id: 'book-2',
        name: 'Book Two',
        author: 'Author Two',
        coverUrl: 'cover2.jpg',
        readingStatus: [{ status }],
        ratings: [],
      },
    ]

    ;(prisma.book.count as jest.Mock).mockResolvedValue(fakeCount)
    ;(prisma.book.findMany as jest.Mock).mockResolvedValue(fakeBooks)

    const req = {
      method: 'GET',
      query: { userId, status, page, perPage, search },
    } as any

    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json })),
      json,
    } as any

    await handler(req, res)

    expect(prisma.book.count).toHaveBeenCalledWith({
      where: expect.objectContaining({
        readingStatus: expect.any(Object),
        OR: expect.any(Array),
      }),
    })

    expect(prisma.book.findMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        readingStatus: expect.any(Object),
        OR: expect.any(Array),
      }),
      skip: 5, // (page 2 - 1) * perPage 5 = 5
      take: 5,
      orderBy: { name: 'asc' },
      select: expect.any(Object),
    })

    expect(json).toHaveBeenCalledWith({
      data: {
        books: [
          {
            id: 'book-1',
            name: 'Book One',
            author: 'Author One',
            coverUrl: 'cover1.jpg',
            userRating: 4,
            readingStatus: status,
          },
          {
            id: 'book-2',
            name: 'Book Two',
            author: 'Author Two',
            coverUrl: 'cover2.jpg',
            userRating: null,
            readingStatus: status,
          },
        ],
        pagination: {
          page: Number(page),
          perPage: Number(perPage),
          total: fakeCount,
          totalPages: Math.ceil(fakeCount / Number(perPage)),
        },
      },
    })
  })
})
