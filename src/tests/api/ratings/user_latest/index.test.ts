/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/ratings/user_latest/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    rating: {
      findFirst: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/pages/api/auth/[...nextauth].api', () => ({
  buildNextAuthOptions: jest.fn(),
}))

describe('GET /api/ratings/user_latest', () => {
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

  it('returns 401 if no session', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const req = { method: 'GET' } as any
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(401)
  })

  it('returns formatted rating data when userLastRating exists', async () => {
    const fakeSession = { user: { id: 'user123' } }
    ;(getServerSession as jest.Mock).mockResolvedValue(fakeSession)

    const fakeRating = {
      description: 'Loved it',
      rate: 5,
      createdAt: new Date('2025-06-03T12:00:00Z'),
      book: {
        id: 'book123',
        name: 'My Book',
        author: 'Author Name',
        coverUrl: 'cover.jpg',
        readingStatus: [{ status: 'READ' }],
      },
      user: {
        name: 'User Name',
        avatarUrl: 'avatar.jpg',
      },
    }

    ;(prisma.rating.findFirst as jest.Mock).mockResolvedValue(fakeRating)

    const req = { method: 'GET' } as any
    const json = jest.fn()
    const res = { json } as any

    await handler(req, res)

    expect(json).toHaveBeenCalledWith({
      rating: {
        book: {
          id: 'book123',
          name: 'My Book',
          author: 'Author Name',
          coverUrl: 'cover.jpg',
        },
        user: {
          name: 'User Name',
          avatarUrl: 'avatar.jpg',
        },
        description: 'Loved it',
        rate: 5,
        createdAt: fakeRating.createdAt,
        readingStatus: 'READ',
      },
    })
  })

  it('returns 500 on error', async () => {
    const fakeSession = { user: { id: 'user123' } }

    ;(getServerSession as jest.Mock).mockResolvedValue(fakeSession)
    ;(prisma.rating.findFirst as jest.Mock).mockRejectedValue(
      new Error('DB error'),
    )

    const req = { method: 'GET' } as any
    const status = jest.fn(() => ({ json: jest.fn() }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(500)
  })
})
