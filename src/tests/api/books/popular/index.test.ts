import { mockReq, mockRes } from '@/tests/utils/http-mocks'
import handler from '@/pages/api/books/popular/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      findMany: jest.fn(),
    },
    rating: {
      groupBy: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('GET /api/books', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns top 6 books with ratings and status', async () => {
    const mockBooks = [
      {
        id: '1',
        name: 'Book 1',
        author: 'Author 1',
        coverUrl: null,
        categories: [{ category: { id: 'cat-1', name: 'Fiction' } }],
        readingStatus: [{ status: 'READING' }],
      },
      {
        id: '2',
        name: 'Book 2',
        author: 'Author 2',
        coverUrl: null,
        categories: [],
        readingStatus: [],
      },
    ]

    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.book.findMany as jest.Mock).mockResolvedValue(mockBooks)
    ;(prisma.rating.groupBy as jest.Mock).mockResolvedValue([
      { bookId: '1', _avg: { rate: 4.5 }, _count: { rate: 2 } },
    ])

    const req = mockReq({ method: 'GET' })
    const json = jest.fn()
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = mockRes({ json, status })

    await handler(req, res)

    expect(prisma.book.findMany).toHaveBeenCalled()
    expect(prisma.rating.groupBy).toHaveBeenCalled()
    expect(json).toHaveBeenCalledWith({
      books: [
        expect.objectContaining({
          id: '1',
          categories: [{ id: 'cat-1', name: 'Fiction' }],
          rate: 4.5,
          ratingCount: 2,
          readingStatus: 'READING',
        }),
        expect.objectContaining({
          id: '2',
          categories: [],
          ratingCount: 0,
          readingStatus: null,
        }),
      ],
    })
  })

  it('returns 405 if not GET', async () => {
    const req = mockReq({ method: 'POST' })
    const end = jest.fn()
    const res = mockRes({ status: jest.fn(() => ({ end })) })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(end).toHaveBeenCalled()
  })
})
