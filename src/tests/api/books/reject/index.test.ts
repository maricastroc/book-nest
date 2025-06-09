import { prisma } from '@/lib/prisma'
import handler from '@/pages/api/books/reject/index.api'
import { getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      update: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('POST /api/books/reject', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if not authenticated', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)
    
    const req = { 
      method: 'POST',
      body: {}
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
      method: 'POST',
      body: {}
    } as NextApiRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' })
  })

  it('should return 400 for invalid status', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { role: 'ADMIN' }
    })
    
    const req = { 
      method: 'POST',
      body: { bookId: 'book-1', status: 'INVALID_STATUS' }
    } as NextApiRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid status' })
  })

  it('should successfully reject a book', async () => {
    const mockSession = {
      user: { 
        id: 'user-123',
        role: 'ADMIN' 
      }
    }
    
    const mockUpdatedBook = {
      id: 'book-1',
      status: 'REJECTED'
    }
    
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.book.update as jest.Mock).mockResolvedValue(mockUpdatedBook)

    const req = { 
      method: 'POST',
      body: { bookId: 'book-1', status: 'REJECTED' }
    } as NextApiRequest
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(prisma.book.update).toHaveBeenCalledWith({
      where: { id: 'book-1' },
      data: { status: 'REJECTED' }
    })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      book: mockUpdatedBook,
      message: 'Book successfully rejected!'
    })
  })

  it('should handle database errors', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { role: 'ADMIN' }
    })
    ;(prisma.book.update as jest.Mock).mockRejectedValue(new Error('DB Error'))

    const req = { 
      method: 'POST',
      body: { bookId: 'book-1', status: 'REJECTED' }
    } as NextApiRequest
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error updating book status'
    })
  })

  it('should return 405 if method is not POST', async () => {
    const req = { method: 'GET' } as NextApiRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.end).toHaveBeenCalled()
  })

  it('should return 400 if bookId is missing', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { role: 'ADMIN' }
    })
    
    const req = { 
      method: 'POST',
      body: { status: 'REJECTED' }
    } as NextApiRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.any(String)
    }))
  })
})