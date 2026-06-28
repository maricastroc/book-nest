import { mockReq, mockRes } from '@/tests/utils/http-mocks'
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
    const req = mockReq({ method: 'POST' })
    const status = jest.fn(() => ({ end: jest.fn() }))
    const res = mockRes({ status })

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(405)
  })

  it('returns categories data', async () => {
    const fakeCategories = [
      { id: '1', name: 'Ficção' },
      { id: '2', name: 'Fantasia' },
    ]
    ;(prisma.category.findMany as jest.Mock).mockResolvedValue(fakeCategories)

    const req = mockReq({ method: 'GET' })
    const json = jest.fn()
    const res = mockRes({ json })

    await handler(req, res)

    expect(prisma.category.findMany).toHaveBeenCalled()
    expect(json).toHaveBeenCalledWith({ categories: fakeCategories })
  })
})
