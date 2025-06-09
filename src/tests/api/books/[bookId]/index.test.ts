/* eslint-disable @typescript-eslint/no-explicit-any */
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
      {
        bookId: 'book-1',
        _avg: { rate: 4 },
      },
    ])

    const req = {
      method: 'GET',
      query: {
        bookId: 'book-1',
      },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ end: jest.fn(), json }))
    const res = { json, status } as any

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
    const req = { method: 'POST', query: { bookId: 'book-1' } } as any
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })
})
