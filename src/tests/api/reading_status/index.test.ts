/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/reading_status/index.api'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    readingStatus: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    rating: {
      updateMany: jest.fn(),
    },
  },
}))

describe('API readingStatus handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET method', () => {
    it('returns 400 if userId or bookId is missing', async () => {
      const req = { method: 'GET', query: {} } as any
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = { status } as any

      await handler(req, res)

      expect(status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({
        message: 'UserId and BookId are required',
      })
    })

    it('returns 404 if readingStatus not found', async () => {
      ;(prisma.readingStatus.findUnique as jest.Mock).mockResolvedValue(null)
      const req = {
        method: 'GET',
        query: { userId: 'u1', bookId: 'b1' },
      } as any
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = { status } as any

      await handler(req, res)

      expect(prisma.readingStatus.findUnique).toHaveBeenCalled()
      expect(status).toHaveBeenCalledWith(404)
      expect(json).toHaveBeenCalledWith({ message: 'Reading status not found' })
    })

    it('returns reading status data if found', async () => {
      const fakeReadingStatus = {
        status: 'reading',
        user: {
          id: 'u1',
          name: 'User 1',
          avatarUrl: 'url',
          email: 'email',
          createdAt: new Date(),
        },
        book: {
          id: 'b1',
          name: 'Book 1',
          author: 'Author 1',
          coverUrl: 'coverUrl',
        },
      }
      ;(prisma.readingStatus.findUnique as jest.Mock).mockResolvedValue(
        fakeReadingStatus,
      )
      const req = {
        method: 'GET',
        query: { userId: 'u1', bookId: 'b1' },
      } as any
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = { status } as any

      await handler(req, res)

      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({
        data: {
          readingStatus: fakeReadingStatus.status,
          book: fakeReadingStatus.book,
          user: fakeReadingStatus.user,
        },
      })
    })
  })

  describe('POST/PUT method', () => {
    it('returns 400 if required body fields missing', async () => {
      const req = { method: 'POST', body: {} } as any
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = { status } as any

      await handler(req, res)

      expect(status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({
        message: 'UserId, BookId, and Status are required.',
      })
    })

    it('updates rating and upserts readingStatus', async () => {
      const req = {
        method: 'POST',
        body: { userId: 'u1', bookId: 'b1', status: 'read' },
      } as any
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = { status } as any
      const updatedStatus = { userId: 'u1', bookId: 'b1', status: 'read' }
      ;(prisma.rating.updateMany as jest.Mock).mockResolvedValue({})
      ;(prisma.readingStatus.upsert as jest.Mock).mockResolvedValue(
        updatedStatus,
      )

      await handler(req, res)

      expect(prisma.rating.updateMany).toHaveBeenCalledWith({
        where: { userId: 'u1', bookId: 'b1' },
        data: { deletedAt: null },
      })
      expect(prisma.readingStatus.upsert).toHaveBeenCalledWith({
        where: { userId_bookId: { userId: 'u1', bookId: 'b1' } },
        update: { status: 'read' },
        create: { userId: 'u1', bookId: 'b1', status: 'read' },
      })
      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith(updatedStatus)
    })
  })

  describe('DELETE method', () => {
    it('returns 400 if userId or bookId missing', async () => {
      const req = { method: 'DELETE', body: {} } as any
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = { status } as any

      await handler(req, res)

      expect(status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({
        message: 'UserId and BookId are required.',
      })
    })

    it('deletes readingStatus and returns success message', async () => {
      const req = {
        method: 'DELETE',
        body: { userId: 'u1', bookId: 'b1' },
      } as any
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = { status } as any
      ;(prisma.readingStatus.delete as jest.Mock).mockResolvedValue({})

      await handler(req, res)

      expect(prisma.readingStatus.delete).toHaveBeenCalledWith({
        where: { userId_bookId: { userId: 'u1', bookId: 'b1' } },
      })
      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({
        message: 'Reading status deleted successfully!',
      })
    })
  })

  it('returns 405 if method not allowed', async () => {
    const req = { method: 'PATCH' } as any
    const end = jest.fn()
    const status = jest.fn(() => ({ end }))
    const res = { status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
    expect(end).toHaveBeenCalled()
  })
})
