import { prisma } from '@/lib/prisma'

import { getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import handler from '@/pages/api/books/submitted/index.api'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('GET /api/books/submitted', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 405 if method is not GET', async () => {
    const req = { method: 'POST' } as NextApiRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.end).toHaveBeenCalled()
  })

  it('should return 401 if not authenticated', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)
    
    const req = { 
      method: 'GET',
      query: {}
    } as NextApiRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' })
  })

  it('should return 403 if user is not ADMIN', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { role: 'USER' }
    })
    
    const req = { 
      method: 'GET',
      query: {}
    } as NextApiRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' })
  })

  it('should return paginated pending books for ADMIN', async () => {
    const mockSession = {
      user: { 
        id: 'user-123',
        role: 'ADMIN' 
      }
    }
    
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.book.count as jest.Mock).mockResolvedValue(2)
    ;(prisma.book.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'book-1',
        name: 'Pending Book 1',
        author: 'Author 1',
        coverUrl: 'cover1.jpg',
        categories: [{ category: { id: 'cat1', name: 'Category 1' } }],
        user: { id: 'user-1', name: 'User 1', avatarUrl: 'avatar1.jpg' }
      },
      {
        id: 'book-2',
        name: 'Pending Book 2',
        author: 'Author 2',
        coverUrl: 'cover2.jpg',
        categories: [{ category: { id: 'cat2', name: 'Category 2' } }],
        user: { id: 'user-2', name: 'User 2', avatarUrl: 'avatar2.jpg' }
      }
    ])

    const req = { 
      method: 'GET',
      query: { page: '1', perPage: '10' }
    } as unknown as NextApiRequest
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(prisma.book.count).toHaveBeenCalledWith({
      where: { status: 'PENDING' }
    })
    
    expect(prisma.book.findMany).toHaveBeenCalledWith({
      where: { status: 'PENDING' },
      skip: 0,
      take: 10,
      select: expect.objectContaining({
        id: true,
        name: true,
        categories: {
          include: {
            category: true
          }
        }
      })
    })

    expect(res.json).toHaveBeenCalledWith({
      data: {
        pendingBooks: [
          {
            id: 'book-1',
            name: 'Pending Book 1',
            author: 'Author 1',
            coverUrl: 'cover1.jpg',
            categories: [{ id: 'cat1', name: 'Category 1' }],
            user: { id: 'user-1', name: 'User 1', avatarUrl: 'avatar1.jpg' }
          },
          {
            id: 'book-2',
            name: 'Pending Book 2',
            author: 'Author 2',
            coverUrl: 'cover2.jpg',
            categories: [{ id: 'cat2', name: 'Category 2' }],
            user: { id: 'user-2', name: 'User 2', avatarUrl: 'avatar2.jpg' }
          }
        ],
        pagination: {
          total: 2,
          page: 1,
          perPage: 10,
          totalPages: 1
        }
      }
    })
  })

  it('should handle default pagination values', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { role: 'ADMIN' }
    })
    ;(prisma.book.count as jest.Mock).mockResolvedValue(0)
    ;(prisma.book.findMany as jest.Mock).mockResolvedValue([])

    const req = { 
      method: 'GET',
      query: {} // Sem page e perPage
    } as NextApiRequest
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(prisma.book.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,    // (1 - 1) * 20
        take: 20     // default perPage
      })
    )
  })
})