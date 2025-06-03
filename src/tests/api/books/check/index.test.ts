/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/books/check/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
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

  it('returns book details when found by ISBN', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.book.findFirst as jest.Mock).mockResolvedValue({
      id: 'book-1',
      name: 'Book One',
      author: 'Book Author',
      coverUrl: 'cover-url',
      isbn: '12345678',
    })

    const req = {
      method: 'GET',
      query: {
        isbn: '12345678',
      },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ end: jest.fn(), json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.book.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [{ isbn: '12345678' }, { name: undefined }],
        },
      }),
    )

    expect(json).toHaveBeenCalledWith({
      book: expect.objectContaining({
        id: 'book-1',
        name: 'Book One',
        author: 'Book Author',
        coverUrl: 'cover-url',
        isbn: '12345678',
      }),
      exists: true,
    })
  })

  it('returns book details when found by title (case insensitive)', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.book.findFirst as jest.Mock).mockResolvedValue({
      id: 'book-2',
      name: 'Book Two',
      author: 'Book 2 Author',
      coverUrl: 'cover-url',
      isbn: '12345678',
    })

    const req = {
      method: 'GET',
      query: {
        title: 'book two',
      },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ end: jest.fn(), json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.book.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { isbn: undefined },
            { name: { equals: 'book two', mode: 'insensitive' } },
          ],
        },
      }),
    )

    expect(json).toHaveBeenCalledWith({
      book: expect.objectContaining({
        id: 'book-2',
        name: 'Book Two',
        author: 'Book 2 Author',
        coverUrl: 'cover-url',
        isbn: '12345678',
      }),
      exists: true,
    })
  })

  it('returns error if both isbn and title are missing', async () => {
    const req = { method: 'GET', query: {} } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ end: jest.fn(), json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(400)
  })

  it('returns 405 if not GET', async () => {
    const req = {
      method: 'POST',
      query: {
        title: 'book two',
      },
    } as any
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })
})
