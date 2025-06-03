/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/library/submitted_books/index.api'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    book: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

describe('GET /api/library/submitted_books', () => {
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

  it('returns 404 if user not found', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const req = { method: 'GET', query: { userId: 'non-existent' } } as any
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status, json } as any

    await handler(req, res)

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'non-existent' },
      select: { avatarUrl: true, name: true, id: true, createdAt: true },
    })
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ message: 'User not found' })
  })

  it('returns paginated books data successfully', async () => {
    const userId = 'user-123'
    const fakeUser = {
      id: userId,
      avatarUrl: 'avatar.png',
      name: 'User Name',
      createdAt: new Date().toISOString(),
    }

    const fakeBooks = [
      {
        id: 'book-1',
        name: 'Book One',
        author: 'Author One',
        coverUrl: 'cover1.jpg',
        publisher: 'Publisher One',
        isbn: '123',
        language: 'en',
        summary: 'Summary 1',
        totalPages: 100,
        publishingYear: 2020,
        _count: { ratings: 2 },
        ratings: [{ rate: 4 }, { rate: 5 }],
        categories: [{ category: { id: 'cat-1', name: 'Fiction' } }],
      },
      {
        id: 'book-2',
        name: 'Book Two',
        author: 'Author Two',
        coverUrl: 'cover2.jpg',
        publisher: 'Publisher Two',
        isbn: '456',
        language: 'en',
        summary: 'Summary 2',
        totalPages: 200,
        publishingYear: 2018,
        _count: { ratings: 0 },
        ratings: [],
        categories: [{ category: { id: 'cat-2', name: 'Non-Fiction' } }],
      },
    ]

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser)
    ;(prisma.book.count as jest.Mock).mockResolvedValue(2)
    ;(prisma.book.findMany as jest.Mock).mockResolvedValue(fakeBooks)

    const req = {
      method: 'GET',
      query: { userId, page: '1', perPage: '20' },
    } as any

    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json })),
      json,
    } as any

    await handler(req, res)

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
      select: { avatarUrl: true, name: true, id: true, createdAt: true },
    })

    expect(prisma.book.count).toHaveBeenCalledWith({
      where: { userId },
    })

    expect(prisma.book.findMany).toHaveBeenCalledWith({
      where: { userId },
      skip: 0,
      take: 20,
      select: expect.any(Object),
    })

    expect(json).toHaveBeenCalledWith({
      data: {
        user: fakeUser,
        submittedBooks: [
          {
            ...fakeBooks[0],
            categories: [{ id: 'cat-1', name: 'Fiction' }],
            ratingCount: 2,
            rate: 4.5,
          },
          {
            ...fakeBooks[1],
            categories: [{ id: 'cat-2', name: 'Non-Fiction' }],
            ratingCount: 0,
            rate: 0,
          },
        ],
        pagination: {
          total: 2,
          page: 1,
          perPage: 20,
          totalPages: 1,
        },
      },
    })
  })
})
