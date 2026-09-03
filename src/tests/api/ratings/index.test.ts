import { mockReq, mockRes } from '@/tests/utils/http-mocks'
import handler from '@/pages/api/ratings/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/pages/api/auth/[...nextauth].api', () => ({
  buildNextAuthOptions: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    rating: {
      findMany: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    readingStatus: {
      upsert: jest.fn(),
    },
  },
}))

describe('API /api/ratings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('returns ratings list without search query', async () => {
      const fakeRatings = [
        {
          id: 'rating1',
          createdAt: new Date(),
          rate: 5,
          description: 'Awesome',
          book: {
            coverUrl: 'cover1.jpg',
            name: 'Book 1',
            author: 'Author 1',
          },
          user: {
            id: 'user1',
            avatarUrl: 'avatar1.jpg',
            name: 'User One',
          },
        },
      ]

      ;(prisma.rating.findMany as jest.Mock).mockResolvedValue(fakeRatings)

      const req = mockReq({ method: 'GET', query: {} })
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = mockRes({ status })

      await handler(req, res)

      expect(prisma.rating.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        include: expect.any(Object),
      })

      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith([
        {
          id: 'rating1',
          createdAt: fakeRatings[0].createdAt,
          rate: 5,
          description: 'Awesome',
          book: {
            coverURL: 'cover1.jpg',
            name: 'Book 1',
            author: 'Author 1',
          },
          user: {
            id: 'user1',
            avatarURL: 'avatar1.jpg',
            name: 'User One',
          },
        },
      ])
    })

    it('returns ratings list filtered by search query', async () => {
      const search = 'book'
      const fakeRatings: unknown[] = []

      ;(prisma.rating.findMany as jest.Mock).mockResolvedValue(fakeRatings)

      const req = mockReq({ method: 'GET', query: { search } })
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = mockRes({ status })

      await handler(req, res)

      expect(prisma.rating.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          book: {
            name: {
              contains: search.toLowerCase(),
              mode: 'insensitive',
            },
          },
        },
        include: expect.any(Object),
      })

      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith([])
    })
  })

  describe('DELETE', () => {
    it('deletes a rating by id', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user1' },
      })
      ;(prisma.rating.findUnique as jest.Mock).mockResolvedValue({
        id: 'rating1',
        userId: 'user1',
      })
      ;(prisma.rating.delete as jest.Mock).mockResolvedValue({})

      const req = mockReq({ method: 'DELETE', body: { id: 'rating1' } })
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = mockRes({ status })

      await handler(req, res)

      expect(prisma.rating.delete).toHaveBeenCalledWith({
        where: { id: 'rating1' },
      })

      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({
        message: 'Review successfully deleted!',
      })
    })
  })

  describe('PUT', () => {
    it('returns 400 if missing required fields', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user1' },
      })
      const req = mockReq({ method: 'PUT', body: { id: '1' } })
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = mockRes({ status })

      await handler(req, res)

      expect(status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({ message: 'Missing required fields' })
    })

    it('returns 404 if rating not found', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user1' },
      })
      ;(prisma.rating.findUnique as jest.Mock).mockResolvedValue(null)

      const req = mockReq({ method: 'PUT', body: { id: '1', rate: 5 } })
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = mockRes({ status })

      await handler(req, res)

      expect(prisma.rating.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
      expect(status).toHaveBeenCalledWith(404)
      expect(json).toHaveBeenCalledWith({ message: 'Rating not found' })
    })

    it('updates and returns rating if valid', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user1' },
      })
      const updatedRating = {
        id: '1',
        userId: 'user1',
        description: 'Updated desc',
        rate: 5,
        user: { id: 'user1', name: 'User One', avatarUrl: 'avatar.jpg' },
      }

      ;(prisma.rating.findUnique as jest.Mock).mockResolvedValue(updatedRating)
      ;(prisma.rating.update as jest.Mock).mockResolvedValue(updatedRating)

      const req = mockReq({
        method: 'PUT',
        body: { id: '1', description: 'Updated desc', rate: 5 },
      })
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = mockRes({ status })

      await handler(req, res)

      expect(prisma.rating.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { description: 'Updated desc', rate: 5 },
        include: { user: true, votes: true },
      })

      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({
        rating: updatedRating,
        message: 'Rating successfully updated!',
      })
    })

    it('returns 500 on update error', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user1' },
      })
      ;(prisma.rating.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        userId: 'user1',
      })
      ;(prisma.rating.update as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      )

      const req = mockReq({
        method: 'PUT',
        body: { id: '1', description: 'desc', rate: 3 },
      })
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = mockRes({ status })

      await handler(req, res)

      expect(status).toHaveBeenCalledWith(500)
      expect(json).toHaveBeenCalledWith({
        message: 'Error updating rating',
        error: expect.any(Error),
      })
    })
  })

  describe('POST', () => {
    it('returns 400 if rate is missing', async () => {
      const req = mockReq({
        method: 'POST',
        body: { data: { userId: 'u1', bookId: 'b1', status: 'READ' } },
      })
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = mockRes({ status })

      await handler(req, res)

      expect(status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({ message: 'Rating is required.' })
    })

    it('returns 400 if status is missing', async () => {
      const req = mockReq({
        method: 'POST',
        body: { data: { userId: 'u1', bookId: 'b1', rate: 5 } },
      })
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = mockRes({ status })

      await handler(req, res)

      expect(status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({ message: 'Book status is required.' })
    })

    it('creates a new rating and reading status', async () => {
      const newRating = {
        id: 'r1',
        bookId: 'b1',
        userId: 'u1',
        description: 'Nice book',
        rate: 4,
        user: { id: 'u1', name: 'User', avatarUrl: 'avatar.jpg' },
      }

      ;(prisma.rating.create as jest.Mock).mockResolvedValue(newRating)
      ;(prisma.readingStatus.upsert as jest.Mock).mockResolvedValue({})

      const req = mockReq({
        method: 'POST',
        body: {
          data: {
            bookId: 'b1',
            userId: 'u1',
            description: 'Nice book',
            rate: 4,
            status: 'READING',
          },
        },
      })
      const json = jest.fn()
      const status = jest.fn(() => ({ json }))
      const res = mockRes({ status })

      await handler(req, res)

      expect(prisma.rating.create).toHaveBeenCalledWith({
        data: {
          bookId: 'b1',
          userId: 'u1',
          description: 'Nice book',
          rate: 4,
        },
        include: { user: true, votes: true },
      })

      expect(prisma.readingStatus.upsert).toHaveBeenCalledWith({
        where: {
          userId_bookId: { userId: 'u1', bookId: 'b1' },
        },
        update: { status: 'READING' },
        create: {
          userId: 'u1',
          bookId: 'b1',
          status: 'READING',
        },
      })

      expect(status).toHaveBeenCalledWith(201)
      expect(json).toHaveBeenCalledWith({
        rating: newRating,
        message: 'Rating successfully created!',
      })
    })
  })

  it('returns 405 on unsupported method', async () => {
    const req = mockReq({ method: 'PATCH' })
    const end = jest.fn()
    const res = mockRes({ status: jest.fn(() => ({ end })) })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(end).toHaveBeenCalled()
  })
})
