/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/books/popular/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      findMany: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('GET /api/books', () => {
  it('returns top 6 books with ratings and status', async () => {
    const mockBooks = [
      {
        id: '1',
        title: 'Book 1',
        ratings: [{ rate: 4 }, { rate: 5 }],
        readingStatus: [{ status: 'READING' }],
      },
      {
        id: '2',
        title: 'Book 2',
        ratings: [],
        readingStatus: [],
      },
    ]

    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.book.findMany as jest.Mock).mockResolvedValue(mockBooks)

    const req = {
      method: 'GET',
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { json, status } as any

    await handler(req, res)

    expect(getServerSession).toHaveBeenCalled()
    expect(prisma.book.findMany).toHaveBeenCalled()
    expect(json).toHaveBeenCalledWith({
      books: [
        {
          id: '1',
          title: 'Book 1',
          ratings: [{ rate: 4 }, { rate: 5 }],
          ratingCount: 2,
          rate: 4.5,
          readingStatus: 'READING',
        },
        {
          id: '2',
          title: 'Book 2',
          ratings: [],
          ratingCount: 0,
          rate: 0,
          readingStatus: null,
        },
      ],
    })
  })

  it('returns 405 if not GET', async () => {
    const req = { method: 'POST' } as any
    const end = jest.fn()
    const res = { status: jest.fn(() => ({ end })) } as any

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(end).toHaveBeenCalled()
  })
})
