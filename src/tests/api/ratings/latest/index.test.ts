/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/ratings/latest/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    rating: {
      findMany: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/pages/api/auth/[...nextauth].api', () => ({
  buildNextAuthOptions: jest.fn(),
}))

describe('GET /api/ratings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 405 if method is not GET', async () => {
    const req = { method: 'POST' } as any
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
    expect(json).toHaveBeenCalledWith({ message: 'Method Not Allowed' })
  })

  it('returns 200 and ratings excluding current user ratings', async () => {
    const fakeSession = { user: { id: 'user123' } }
    ;(getServerSession as jest.Mock).mockResolvedValue(fakeSession)

    const fakeRatings = [
      {
        id: 'r1',
        description: 'Great book',
        book: {
          id: 'b1',
          name: 'Book One',
          author: 'Author One',
          coverUrl: 'url1',
        },
        user: {
          id: 'user456',
          name: 'User Two',
        },
      },
    ]

    ;(prisma.rating.findMany as jest.Mock).mockResolvedValue(fakeRatings)

    const req = { method: 'GET' } as any
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any

    await handler(req, res)

    expect(prisma.rating.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          deletedAt: null,
          NOT: { description: '' },
          userId: { not: 'user123' },
        }),
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          book: {
            select: { id: true, name: true, author: true, coverUrl: true },
          },
          user: true,
        },
      }),
    )
    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({ ratings: fakeRatings })
  })

  it('handles missing session gracefully and returns ratings without user exclusion', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const fakeRatings = [
      {
        id: 'r2',
        description: 'Another book',
        book: {
          id: 'b2',
          name: 'Book Two',
          author: 'Author Two',
          coverUrl: 'url2',
        },
        user: {
          id: 'user789',
          name: 'User Three',
        },
      },
    ]

    ;(prisma.rating.findMany as jest.Mock).mockResolvedValue(fakeRatings)

    const req = { method: 'GET' } as any
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any

    await handler(req, res)

    expect(prisma.rating.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          deletedAt: null,
          NOT: { description: '' },
        }),
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          book: {
            select: { id: true, name: true, author: true, coverUrl: true },
          },
          user: true,
        },
      }),
    )
    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({ ratings: fakeRatings })
  })

  it('returns 500 on error', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user123' },
    })
    ;(prisma.rating.findMany as jest.Mock).mockRejectedValue(
      new Error('DB error'),
    )

    const req = { method: 'GET' } as any
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(500)
    expect(json).toHaveBeenCalledWith({ message: 'Internal Server Error' })
  })
})
