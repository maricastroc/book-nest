/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/library/books_by_status/index.api'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      findMany: jest.fn(),
    },
  },
}))

describe('GET /api/library/books_by_status', () => {
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

  it('returns 400 if userId is missing', async () => {
    const req = { method: 'GET', query: {} } as any
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status, json } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({ message: 'UserId is required' })
  })

  it('returns grouped books by status with user rating', async () => {
    const userId = 'user-123'
    const fakeBooks = [
      {
        id: 'book-1',
        name: 'Book One',
        author: 'Author One',
        coverUrl: 'cover1.jpg',
        readingStatus: [{ status: 'reading' }],
        ratings: [{ rate: 4 }],
        status: 'APPROVED',
      },
      {
        id: 'book-2',
        name: 'Book Two',
        author: 'Author Two',
        coverUrl: 'cover2.jpg',
        readingStatus: [{ status: 'completed' }],
        ratings: [],
        status: 'APPROVED',
      },
      {
        id: 'book-3',
        name: 'Book Three',
        author: 'Author Three',
        coverUrl: 'cover3.jpg',
        readingStatus: [],
        ratings: [],
        status: 'APPROVED',
      },
    ]

    ;(prisma.book.findMany as jest.Mock).mockResolvedValue(fakeBooks)

    const req = {
      method: 'GET',
      query: { userId },
    } as any

    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json })),
      json,
    } as any

    await handler(req, res)

    expect(prisma.book.findMany).toHaveBeenCalledWith({
      where: {
        status: 'APPROVED',
        OR: [{ readingStatus: { some: { userId } } }, { userId }],
      },
      select: {
        id: true,
        name: true,
        author: true,
        coverUrl: true,
        readingStatus: {
          where: { userId },
          select: { status: true },
        },
        ratings: {
          where: { userId },
          select: { rate: true },
        },
      },
    })

    expect(json).toHaveBeenCalledWith({
      data: {
        booksByStatus: {
          reading: [
            {
              id: 'book-1',
              name: 'Book One',
              author: 'Author One',
              coverUrl: 'cover1.jpg',
              userRating: 4,
            },
          ],
          completed: [
            {
              id: 'book-2',
              name: 'Book Two',
              author: 'Author Two',
              coverUrl: 'cover2.jpg',
              userRating: null,
            },
          ],
          unknown: [
            {
              id: 'book-3',
              name: 'Book Three',
              author: 'Author Three',
              coverUrl: 'cover3.jpg',
              userRating: null,
            },
          ],
        },
      },
    })
  })
})
