/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/profile/[userId].api'
import { prisma } from '@/lib/prisma'
import { getMostFrequentString } from '@/utils/getMostFrequentString'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    book: {
      findMany: jest.fn(),
    },
  },
}))

jest.mock('@/utils/getMostFrequentString', () => ({
  getMostFrequentString: jest.fn(),
}))

describe('GET /api/profile/summary/[userId]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

  it('returns 404 if user not found', async () => {
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
    expect(json).toHaveBeenCalledWith({ message: 'User does not exist.' })
  })

  it('returns profile data with computed stats without search filter', async () => {
    const userId = 'user-123'

    const fakeProfile = {
      id: userId,
      avatarUrl: 'avatar.png',
      name: 'User Name',
      email: 'user@example.com',
      createdAt: new Date().toISOString(),
      ratings: [
        {
          id: 'rating-1',
          createdAt: new Date().toISOString(),
          book: {
            id: 'book-1',
            name: 'Book One',
            author: 'Author One',
            categories: [{ category: { name: 'Fiction' } }],
            readingStatus: [{ status: 'READ' }],
            ratings: [],
            totalPages: 200,
          },
        },
      ],
    }

    const allReadBooks = [
      {
        id: 'book-1',
        name: 'Book One',
        author: 'Author One',
        categories: [{ category: { name: 'Fiction' } }],
        readingStatus: [{ status: 'READ' }],
        ratings: [],
        totalPages: 200,
      },
      {
        id: 'book-2',
        name: 'Book Two',
        author: 'Author Two',
        categories: [{ category: { name: 'Sci-Fi' } }],
        readingStatus: [{ status: 'READ' }],
        ratings: [],
        totalPages: 300,
      },
    ]

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(fakeProfile)
    ;(prisma.book.findMany as jest.Mock).mockResolvedValue(allReadBooks)
    ;(getMostFrequentString as jest.Mock).mockReturnValue('Fiction')

    const req = {
      method: 'GET',
      query: { userId },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: userId } }),
    )
    expect(prisma.book.findMany).toHaveBeenCalledTimes(1)

    expect(getMostFrequentString).toHaveBeenCalledWith(
      expect.arrayContaining(['Fiction', 'Sci-Fi']),
    )

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: expect.objectContaining({
          user: expect.objectContaining({ id: userId, name: 'User Name' }),
          readPages: 500,
          ratedBooks: 1,
          authorsCount: 2,
          bestGenre: 'Fiction',
          ratings: expect.any(Array),
          readBooks: expect.any(Array),
        }),
      }),
    )
  })

  it('returns profile data with computed stats with search filter', async () => {
    const userId = 'user-123'

    const fakeProfile = {
      id: userId,
      avatarUrl: 'avatar.png',
      name: 'User Name',
      email: 'user@example.com',
      createdAt: new Date().toISOString(),
      ratings: [],
    }

    const allReadBooks = [
      {
        id: 'book-1',
        name: 'Book One',
        author: 'Author One',
        categories: [{ category: { name: 'Fiction' } }],
        readingStatus: [{ status: 'READ' }],
        ratings: [],
        totalPages: 200,
      },
      {
        id: 'book-2',
        name: 'Book Two',
        author: 'Author Two',
        categories: [{ category: { name: 'Sci-Fi' } }],
        readingStatus: [{ status: 'READ' }],
        ratings: [],
        totalPages: 300,
      },
    ]

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(fakeProfile)
    ;(prisma.book.findMany as jest.Mock)
      .mockResolvedValueOnce(allReadBooks)
      .mockResolvedValueOnce(allReadBooks)
    ;(getMostFrequentString as jest.Mock).mockReturnValue('Fiction')

    const req = {
      method: 'GET',
      query: { userId, search: 'some search' },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: userId } }),
    )
    expect(prisma.book.findMany).toHaveBeenCalledTimes(2) // 2 chamadas

    expect(getMostFrequentString).toHaveBeenCalledWith(
      expect.arrayContaining(['Fiction', 'Sci-Fi']),
    )

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: expect.objectContaining({
          user: expect.objectContaining({ id: userId, name: 'User Name' }),
          readPages: 500,
          ratedBooks: 0,
          authorsCount: 2,
          bestGenre: 'Fiction',
          ratings: expect.any(Array),
          readBooks: expect.any(Array),
        }),
      }),
    )
  })
})
