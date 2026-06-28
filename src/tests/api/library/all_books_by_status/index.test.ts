import { mockReq, mockRes } from '@/tests/utils/http-mocks'
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
    const req = mockReq({ method: 'POST' })
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = mockRes({ status })

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })

  it('returns 400 if userId or status are missing', async () => {
    const req = mockReq({ method: 'GET', query: { userId: '123' } })
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = mockRes({ status, json })

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

    const req = mockReq({
      method: 'GET',
      query: { userId, status, page, perPage, search },
    })

    const json = jest.fn()
    const res = mockRes({
      status: jest.fn(() => ({ json })),
      json,
    })

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
      skip: 5,
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
