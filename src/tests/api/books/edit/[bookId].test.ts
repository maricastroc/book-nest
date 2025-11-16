/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/books/edit/[bookId].api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { IncomingForm } from 'formidable'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    book: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
    categoriesOnBooks: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('formidable', () => ({
  IncomingForm: jest.fn().mockImplementation(() => ({
    parse: jest.fn(),
  })),
}))

describe('PUT /api/books/[bookId]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  /* -------------------- ADMIN SUCCESS -------------------- */
  it('should update a book successfully being an ADMIN', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      role: 'ADMIN',
    })
    ;(prisma.book.findUnique as jest.Mock).mockResolvedValue({
      id: 'book-1',
      name: 'Old Book Name',
      author: 'Old Author',
      userId: 'user-123',
      categories: [],
    })
    ;(prisma.book.update as jest.Mock).mockResolvedValue({
      id: 'book-1',
      name: 'Updated Book Name',
      author: 'Updated Author',
      categories: [],
    })
    ;(prisma.category.findMany as jest.Mock).mockResolvedValue([
      { id: 'cat1' },
      { id: 'cat2' },
    ])
    ;(prisma.categoriesOnBooks.findMany as jest.Mock).mockResolvedValue([])

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = {
      method: 'PUT',
      query: { bookId: 'book-1' },
    } as any

    let resolveParse: any
    const parseCompleted = new Promise((resolve) => (resolveParse = resolve))

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(
          null,
          {
            name: ['Updated Book Name'],
            author: ['Updated Author'],
            summary: ['Updated Summary'],
            publisher: ['Updated Publisher'],
            language: ['English'],
            totalPages: ['300'],
            publishingYear: ['2024'],
            categories: [JSON.stringify(['cat1', 'cat2'])],
          },
          {},
        )
        resolveParse()
      })
    })

    ;(IncomingForm as unknown as jest.Mock).mockImplementation(() => ({
      parse: mockParse,
    }))

    await handler(req, res)
    await parseCompleted
    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({
      message: 'Book successfully approved!',
      book: expect.objectContaining({
        name: 'Updated Book Name',
        author: 'Updated Author',
      }),
    })
  })

  it('should return 403 if user is not ADMIN', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      role: 'USER',
    })
    ;(prisma.book.findUnique as jest.Mock).mockResolvedValue({
      id: 'book-1',
      userId: 'another-user',
      categories: [],
    })

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = { method: 'PUT', query: { bookId: 'book-1' } } as any

    const mockParse = jest.fn()
    ;(IncomingForm as unknown as jest.Mock).mockImplementation(() => ({
      parse: mockParse,
    }))

    await handler(req, res)

    expect(mockParse).not.toHaveBeenCalled()

    expect(status).toHaveBeenCalledWith(403)
    expect(json).toHaveBeenCalledWith({
      message: 'Access denied',
    })
  })

  it('should return 404 if book is not found', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      role: 'ADMIN',
    })
    ;(prisma.book.findUnique as jest.Mock).mockResolvedValue(null)

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = { method: 'PUT', query: { bookId: 'book-1' } } as any

    let resolveParse: any
    const parseCompleted = new Promise((resolve) => (resolveParse = resolve))

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(null, {}, {})
        resolveParse()
      })
    })

    ;(IncomingForm as unknown as jest.Mock).mockImplementation(() => ({
      parse: mockParse,
    }))

    await handler(req, res)
    await parseCompleted
    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(404)
  })

  /* -------------------- INVALID DATA -------------------- */
  it('should return 400 for invalid data', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      role: 'ADMIN',
    })
    ;(prisma.book.findUnique as jest.Mock).mockResolvedValue({
      id: 'book-1',
      name: 'Old Book',
      author: 'Old Author',
      userId: 'user-123',
      categories: [],
    })

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = { method: 'PUT', query: { bookId: 'book-1' } } as any

    let resolveParse: any
    const parseCompleted = new Promise((resolve) => (resolveParse = resolve))

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(
          null,
          {
            name: [''],
            author: ['A'],
            totalPages: ['0'],
          },
          {},
        )
        resolveParse()
      })
    })

    ;(IncomingForm as unknown as jest.Mock).mockImplementation(() => ({
      parse: mockParse,
    }))

    await handler(req, res)
    await parseCompleted
    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation error',
      }),
    )
  })

  /* -------------------- INVALID CATEGORIES -------------------- */
  it('should return 400 for invalid categories', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      role: 'ADMIN',
    })
    ;(prisma.book.findUnique as jest.Mock).mockResolvedValue({
      id: 'book-1',
      categories: [],
    })
    ;(prisma.category.findMany as jest.Mock).mockResolvedValue([
      { id: 'valid-cat' },
    ])

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = { method: 'PUT', query: { bookId: 'book-1' } } as any

    let resolveParse: any
    const parseCompleted = new Promise((resolve) => (resolveParse = resolve))

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(
          null,
          {
            name: ['Valid Name'],
            author: ['Valid Author'],
            categories: [JSON.stringify(['valid-cat', 'invalid-cat'])],
          },
          {},
        )
        resolveParse()
      })
    })

    ;(IncomingForm as unknown as jest.Mock).mockImplementation(() => ({
      parse: mockParse,
    }))

    await handler(req, res)
    await parseCompleted
    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({
      message: 'Some categories are invalid',
    })
  })
})
