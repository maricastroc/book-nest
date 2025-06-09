/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/books/edit/[bookId].api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { IncomingForm } from 'formidable'

jest.mock('@/lib/prisma', () => ({
  prisma: {
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

  it('should update a book successfully being an ADMIN', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123', role: 'ADMIN' },
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

    let resolveParse: (value?: unknown) => void
    const parseCompleted = new Promise((resolve) => {
      resolveParse = resolve
    })

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
    expect(prisma.book.findUnique).toHaveBeenCalledWith({
      where: { id: 'book-1' },
      include: { categories: true },
    })
    expect(prisma.book.update).toHaveBeenCalled()
  })

  it("should return 403 if user tries to edit without being an ADMIN", async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123', role: 'USER' },
    })
    ;(prisma.book.findUnique as jest.Mock).mockResolvedValue({
      id: 'book-1',
      userId: 'another-user',
      categories: [],
    })

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any

    const req = {
      method: 'PUT',
      query: { bookId: 'book-1' },
    } as any

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(null, {}, {})
      })
    })
    ;(IncomingForm as unknown as jest.Mock).mockImplementation(() => ({
      parse: mockParse,
    }))

    await handler(req, res)

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(403)
    expect(json).toHaveBeenCalledWith({
      message: 'Access denied',
    })
  })

  it('should return 404 if book is not found', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123', role: 'ADMIN' },
    })
    ;(prisma.book.findUnique as jest.Mock).mockResolvedValue(null)

    const status = jest.fn(() => ({ json: jest.fn() }))
    const res = { status } as any
    const req = {
      method: 'PUT',
      query: { bookId: 'book-1' },
    } as any

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(null, {}, {})
      })
    })
    ;(IncomingForm as unknown as jest.Mock).mockImplementation(() => ({
      parse: mockParse,
    }))

    await handler(req, res)

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(404)
  })

  it('should return 405 if request method is not PUT', async () => {
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { status } as any
    const req = { method: 'POST' } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })

  it('should return 400 for invalid data', async () => {
  ;(getServerSession as jest.Mock).mockResolvedValue({
    user: { id: 'user-123', role: 'ADMIN' },
  })
  ;(prisma.book.findUnique as jest.Mock).mockResolvedValue({
    id: 'book-1',
    name: 'Old Book Name',
    author: 'Old Author',
    userId: 'user-123',
    categories: [],
  })

  const json = jest.fn()
  const status = jest.fn(() => ({ json }))
  const res = { status } as any
  const req = {
    method: 'PUT',
    query: { bookId: 'book-1' },
  } as any

      let resolveParse: (value?: unknown) => void
    const parseCompleted = new Promise((resolve) => {
      resolveParse = resolve
    })

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
  expect(json).toHaveBeenCalledWith({
    message: 'Validation error',
    errors: expect.arrayContaining([
      expect.stringContaining('Book name is required'),
      expect.stringContaining('must be greater than zero'),
    ]),
  })
})

it('should return 400 for invalid categories', async () => {
  ;(getServerSession as jest.Mock).mockResolvedValue({
    user: { id: 'user-123', role: 'ADMIN' },
  })
  ;(prisma.book.findUnique as jest.Mock).mockResolvedValue({
    id: 'book-1',
    name: 'Old Book Name',
    author: 'Old Author',
    userId: 'user-123',
    categories: [],
  })
  ;(prisma.category.findMany as jest.Mock).mockResolvedValue([
    { id: 'valid-cat' },
  ])

  const json = jest.fn()
  const status = jest.fn(() => ({ json }))
  const res = { status } as any
  const req = {
    method: 'PUT',
    query: { bookId: 'book-1' },
  } as any

        let resolveParse: (value?: unknown) => void
    const parseCompleted = new Promise((resolve) => {
      resolveParse = resolve
    })

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
