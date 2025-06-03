/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/user/create/index.api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import bcrypt from 'bcrypt'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
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

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    unlink: jest.fn(),
  },
}))

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedpassword'),
}))

describe('POST /api/users/create', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a user without avatar successfully', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: null,
    })

    let resolveParse: (value?: unknown) => void
    const parseCompleted = new Promise((resolve) => {
      resolveParse = resolve
    })

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(
          null,
          {
            name: ['Test User'],
            email: ['test@example.com'],
            password: ['password123'],
          },
          {},
        )
        resolveParse()
      })
    })
    ;(IncomingForm as unknown as jest.Mock).mockImplementation(() => ({
      parse: mockParse,
    }))

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = { method: 'POST' } as any

    await handler(req, res)
    await parseCompleted

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: null,
    })
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
  })

  it('should create a user with avatar successfully', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: 'data:image/jpeg;base64,filecontent',
    })
    ;(fs.promises.readFile as jest.Mock).mockResolvedValue(
      Buffer.from('filecontent'),
    )
    ;(fs.promises.unlink as jest.Mock).mockResolvedValue(undefined)

    let resolveParse: (value?: unknown) => void
    const parseCompleted = new Promise((resolve) => {
      resolveParse = resolve
    })

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(
          null,
          {
            name: ['Test User'],
            email: ['test@example.com'],
            password: ['password123'],
          },
          {
            avatarUrl: [
              {
                filepath: '/tmp/avatar.jpg',
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

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = { method: 'POST' } as any

    await handler(req, res)
    await parseCompleted

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: 'data:image/jpeg;base64,filecontent',
    })
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
  })

  it('should return error 403 if user is already logged in', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'existing-user' },
    })

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = { method: 'POST' } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(403)
    expect(json).toHaveBeenCalledWith({ message: 'You are already logged in.' })
  })

  it('deve retornar erro se email já estiver em uso', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'existing-user',
      email: 'existing@example.com',
    })

    let resolveParse: (value?: unknown) => void
    const parseCompleted = new Promise((resolve) => {
      resolveParse = resolve
    })

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(
          null,
          {
            name: ['Test User'],
            email: ['existing@example.com'],
            password: ['password123'],
          },
          {},
        )
        resolveParse()
      })
    })
    ;(IncomingForm as unknown as jest.Mock).mockImplementation(() => ({
      parse: mockParse,
    }))

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = { method: 'POST' } as any

    await handler(req, res)
    await parseCompleted

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({
      message: 'This email address is already in use.',
    })
  })

  it('deve retornar erro se avatar for maior que 2MB', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: 'data:image/jpeg;base64,filecontent',
    })
    ;(fs.promises.readFile as jest.Mock).mockResolvedValue(
      Buffer.alloc(3 * 1024 * 1024),
    )
    ;(fs.promises.unlink as jest.Mock).mockResolvedValue(undefined)

    let resolveParse: (value?: unknown) => void
    const parseCompleted = new Promise((resolve) => {
      resolveParse = resolve
    })

    const mockParse = jest.fn((req, callback) => {
      process.nextTick(() => {
        callback(
          null,
          {
            name: ['Test User'],
            email: ['test@example.com'],
            password: ['password123'],
          },
          {
            avatarUrl: [
              {
                filepath: '/tmp/avatar.jpg',
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

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = { method: 'POST' } as any

    await handler(req, res)
    await parseCompleted

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({
      message: 'Image must be a maximum of 2MB!',
    })
  })
})
