/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/ratings/[bookId]/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      findUnique: jest.fn(),
    },
    rating: {
      create: jest.fn(),
    },
    readingStatus: {
      upsert: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/pages/api/auth/[...nextauth].api', () => ({
  buildNextAuthOptions: jest.fn(),
}))

describe('POST /api/ratings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 405 if method is not POST', async () => {
    const req = { method: 'GET' } as any
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })

  it('returns 401 if no session', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const req = {
      method: 'POST',
      query: { bookId: 'book123' },
      body: {
        description: 'Good book',
        rate: 4,
      },
    } as any

    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(401)
  })

  it('returns 400 if book does not exist', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user123' },
    })
    ;(prisma.book.findUnique as jest.Mock).mockResolvedValue(null)

    const req = {
      method: 'POST',
      query: { bookId: 'book123' },
      body: {
        description: 'Good book',
        rate: 4,
      },
    } as any

    const status = jest.fn(() => ({ json: jest.fn() }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(400)
  })

  it('creates rating and updates reading status', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user123' },
    })
    ;(prisma.book.findUnique as jest.Mock).mockResolvedValue({
      id: 'book123',
      name: 'Book Name',
    })
    ;(prisma.rating.create as jest.Mock).mockResolvedValue({
      id: 'rating123',
      description: 'Good book',
      bookId: 'book123',
      userId: 'user123',
      rate: 4,
      user: { id: 'user123', name: 'User' },
    })
    ;(prisma.readingStatus.upsert as jest.Mock).mockResolvedValue({
      userId: 'user123',
      bookId: 'book123',
      status: 'READ',
    })

    const req = {
      method: 'POST',
      query: { bookId: 'book123' },
      body: {
        description: 'Good book',
        rate: 4,
      },
    } as any

    const json = jest.fn()
    const res = { status: jest.fn(() => ({ json })), json } as any

    await handler(req, res)

    expect(prisma.book.findUnique).toHaveBeenCalledWith({
      where: { id: 'book123' },
    })

    expect(prisma.rating.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          description: 'Good book',
          bookId: 'book123',
          userId: 'user123',
          rate: 4,
        }),
        include: { user: true },
      }),
    )
    expect(prisma.readingStatus.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_bookId: { userId: 'user123', bookId: 'book123' } },
        update: { status: 'READ' },
        create: { userId: 'user123', bookId: 'book123', status: 'READ' },
      }),
    )
    expect(res.status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalled()
  })
})
