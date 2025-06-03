/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/profile/statistics/[userId].api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    book: {
      findMany: jest.fn(),
    },
    rating: {
      count: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('GET /api/profile/statistics/[userId]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns list of users with pagination', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Jon Doe',
      email: 'jondoe@email.com',
      avatarUrl: 'url',
      createdAt: '11/22/33',
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
    ;(prisma.rating.count as jest.Mock).mockResolvedValue(5)

    const req = {
      method: 'GET',
      query: {
        userId: 'user-1',
      },
    } as any

    const json = jest.fn()
    const end = jest.fn()
    const status = jest.fn(() => ({ json, end }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.user.findUnique).toHaveBeenCalled()
    expect(prisma.book.findMany).toHaveBeenCalled()
    expect(prisma.rating.count).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    })
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        readPages: expect.any(Number),
        authorsCount: expect.any(Number),
        bestGenre: expect.any(String),
        ratedBooks: 5,
        user: expect.objectContaining({
          avatarUrl: 'url',
          name: 'Jon Doe',
          createdAt: '11/22/33',
        }),
      }),
    )
  })

  it('returns 404 if user is not found', async () => {
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

  it('returns zero stats when user has no read books', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'No Books',
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    })
    ;(prisma.book.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.rating.count as jest.Mock).mockResolvedValue(0)

    const req = {
      method: 'GET',
      query: { userId: 'user-1' },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        readPages: 0,
        authorsCount: 0,
        bestGenre: null,
        ratedBooks: 0,
        user: expect.objectContaining({ name: 'No Books' }),
      }),
    )
  })
})
