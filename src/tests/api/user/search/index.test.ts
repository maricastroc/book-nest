/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/user/search/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('GET /api/users/search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns list of users with pagination', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'user-1',
        name: 'First User',
        email: 'jondoe@email.com',
        avatarUrl: 'url',
        createdAt: '11/22/33',
      },
    ])
    ;(prisma.user.count as jest.Mock).mockResolvedValue(1)

    const req = {
      method: 'GET',
      query: {
        page: '1',
        perPage: '10',
      },
    } as any

    const json = jest.fn()
    const end = jest.fn()
    const status = jest.fn(() => ({ json, end }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.user.findMany).toHaveBeenCalled()

    expect(json).toHaveBeenCalledWith({
      data: {
        users: [
          {
            id: 'user-1',
            name: 'First User',
            email: 'jondoe@email.com',
            avatarUrl: 'url',
            createdAt: '11/22/33',
          },
        ],
        pagination: {
          page: 1,
          perPage: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })
  })

  it('returns 405 if not GET', async () => {
    const req = { method: 'POST' } as any
    const json = jest.fn()
    const end = jest.fn()
    const status = jest.fn(() => ({ json, end }))
    const res = { json, status } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })

  it('returns filtered users when search query is provided', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'user-2',
        name: 'Jane Doe',
        email: 'jane@email.com',
        avatarUrl: 'avatar',
        createdAt: '2023-10-10',
      },
    ])
    ;(prisma.user.count as jest.Mock).mockResolvedValue(1)

    const req = {
      method: 'GET',
      query: {
        page: '1',
        perPage: '10',
        search: 'Jane',
      },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          name: {
            contains: 'jane',
            mode: 'insensitive',
          },
        },
      }),
    )

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          users: expect.any(Array),
          pagination: expect.any(Object),
        },
      }),
    )
  })

  it('defaults to page 1 and perPage 12 when invalid values are provided', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.user.count as jest.Mock).mockResolvedValue(0)

    const req = {
      method: 'GET',
      query: {
        page: '0',
        perPage: '-5',
      },
    } as any

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { json, status } as any

    await handler(req, res)

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 12,
      }),
    )
  })
})
