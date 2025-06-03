/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/books/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      findMany: jest.fn(),
      count: jest.fn(),
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

  it('returns list of books with pagination and rating data', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.book.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'book-1',
        name: 'Book One',
        author: 'Author A',
        coverUrl: 'url-a',
        categories: [
          {
            category: { id: 'cat-1', name: 'Ficção' },
          },
        ],
        readingStatus: [
          {
            status: 'READING',
          },
        ],
      },
    ])
    ;(prisma.book.count as jest.Mock).mockResolvedValue(1)
    ;(prisma.rating.groupBy as jest.Mock).mockResolvedValue([
      {
        bookId: 'book-1',
        _avg: { rate: 4.5 },
        _count: { rate: 10 },
      },
    ])

    const req = {
      method: 'GET',
      query: {
        category: 'cat-1',
        search: 'Book',
        page: '1',
        perPage: '10',
      },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.book.findMany).toHaveBeenCalled()
    expect(prisma.rating.groupBy).toHaveBeenCalled()

    expect(json).toHaveBeenCalledWith({
      data: {
        books: [
          {
            id: 'book-1',
            name: 'Book One',
            author: 'Author A',
            coverUrl: 'url-a',
            categories: [{ id: 'cat-1', name: 'Ficção' }],
            rate: 4.5,
            ratingCount: 10,
            readingStatus: 'READING',
          },
        ],
        pagination: {
          page: 1,
          perPage: 10,
          total: 1,
          totalPages: 1,
        },
      },
    })
  })

  it('returns 405 if not GET', async () => {
    const req = { method: 'POST' } as any
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })
})
