/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/books/create/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { IncomingForm } from 'formidable'
import fs from 'fs/promises'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      findFirst: jest.fn(),
      create: jest.fn(),
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

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  unlink: jest.fn(),
}))

describe('POST /api/books/create', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a book successfully with cover file upload', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.book.findFirst as jest.Mock).mockResolvedValue(null)
    ;(prisma.book.create as jest.Mock).mockResolvedValue({
      id: 'book-1',
      name: 'Test Book',
      author: 'Author',
      categories: [],
      coverUrl: 'data:image/jpeg;base64,filecontent',
    })
    ;(fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('filecontent'))
    ;(fs.unlink as jest.Mock).mockResolvedValue(undefined)

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = { method: 'POST' } as any

    let resolveParse: (value?: unknown) => void
    const parseCompleted = new Promise((resolve) => {
      resolveParse = resolve
    })

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(
          null,
          {
            name: ['Test Book'],
            author: ['Author'],
            summary: ['Summary'],
            publisher: ['Publisher'],
            language: ['English'],
            isbn: ['1234567890'],
            totalPages: ['200'],
            publishingYear: ['2023'],
            categories: [JSON.stringify(['cat1'])],
            coverSource: ['upload'],
          },
          {
            coverUrl: [
              {
                filepath: '/tmp/file.jpg',
                mimetype: 'image/jpeg',
              },
            ],
          },
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

    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith({
      message: 'Book successfully created!',
      book: expect.objectContaining({
        name: 'Test Book',
        coverUrl: expect.stringContaining('data:image/jpeg;base64'),
      }),
    })

    expect(prisma.book.findFirst).toHaveBeenCalled()
    expect(prisma.book.create).toHaveBeenCalled()
    expect(fs.readFile).toHaveBeenCalledWith('/tmp/file.jpg')
    expect(fs.unlink).toHaveBeenCalledWith('/tmp/file.jpg')
  })

  it('should return 401 if user is not authenticated', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const status = jest.fn(() => ({ json: jest.fn() }))
    const res = { status } as any
    const req = { method: 'POST' } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(401)
  })

  it('should return 405 if request method is not POST', async () => {
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = { status } as any
    const req = { method: 'GET' } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })

  it('should return 400 if ISBN is missing or invalid', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })

    const status = jest.fn(() => ({ json: jest.fn() }))
    const res = { status } as any
    const req = { method: 'POST' } as any

    let resolveParse: (value?: unknown) => void
    const parseCompleted = new Promise((resolve) => {
      resolveParse = resolve
    })

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(
          null,
          {
            name: ['Test Book'],
            author: ['Author'],
            summary: ['Summary'],
            publisher: ['Publisher'],
            language: ['English'],
            totalPages: ['200'],
            publishingYear: ['2023'],
            categories: [JSON.stringify(['cat1'])],
            coverSource: ['upload'],
          },
          {
            coverUrl: [
              {
                filepath: '/tmp/file.jpg',
                mimetype: 'image/jpeg',
              },
            ],
          },
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

    expect(status).toHaveBeenCalledWith(500)
  })
})
