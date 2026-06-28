import { mockReq, mockRes } from '@/tests/utils/http-mocks'
import handler from '@/pages/api/books/[bookId]/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      findUnique: jest.fn(),
    },
    rating: {
      groupBy: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
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

  it('returns book details with user, ratings and categories', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.book.findUnique as jest.Mock).mockResolvedValue({
      id: 'book-1',
      name: 'Book One',
      ratings: [
        {
          rate: 4,
          userId: 'user-123',
          deletedAt: null,
          user: { id: 'user-123', name: 'User One' },
          votes: [
            { type: 'UP', userId: 'user789' },
            { type: 'DOWN', userId: 'user456' },
            { type: 'UP', userId: 'user999' },
          ],
        },
      ],
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
      user: {
        avatarUrl: 'avatar-user',
        name: 'Jon Doe',
        id: 'id-1',
      },
    })
    ;(prisma.rating.groupBy as jest.Mock).mockResolvedValue([
      { bookId: 'book-1', _avg: { rate: 4 } },
    ])
    ;(prisma.rating.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'rating-1',
        rate: 4,
        userId: 'other-user',
        deletedAt: null,
        user: { id: 'other-user', name: 'Other User' },
        votes: [],
      },
    ])
    ;(prisma.rating.findFirst as jest.Mock).mockResolvedValue(null)

    const req = mockReq({
      method: 'GET',
      query: {
        bookId: 'book-1',
      },
    })

    const json = jest.fn()
    const status = jest.fn(() => ({ end: jest.fn(), json }))
    const res = mockRes({ json, status })

    await handler(req, res)

    expect(prisma.book.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'book-1' },
      }),
    )

    expect(json).toHaveBeenCalledWith({
      book: expect.objectContaining({
        id: 'book-1',
        ratings: expect.any(Array),
        rate: 4,
        readingStatus: 'READING',
        categories: [{ id: 'cat-1', name: 'Ficção' }],
        user: {
          avatarUrl: 'avatar-user',
          name: 'Jon Doe',
          id: 'id-1',
        },
      }),
    })
  })

  it('returns 405 if not GET', async () => {
    const req = mockReq({ method: 'POST', query: { bookId: 'book-1' } })
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = mockRes({ status })

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })
})
