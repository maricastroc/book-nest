/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/categories/index.api'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
    },
  },
}))

describe('GET /api/categories', () => {
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

  it('returns categories data', async () => {
    const fakeCategories = [
      { id: '1', name: 'Ficção' },
      { id: '2', name: 'Fantasia' },
    ]
    ;(prisma.category.findMany as jest.Mock).mockResolvedValue(fakeCategories)

    const req = { method: 'GET' } as any
    const json = jest.fn()
    const res = { json } as any

    await handler(req, res)

    expect(prisma.category.findMany).toHaveBeenCalled()
    expect(json).toHaveBeenCalledWith({ categories: fakeCategories })
  })
})
