/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from '@/pages/api/user/edit/[userId].api'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import bcrypt from 'bcrypt'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
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

describe('PUT /api/users/edit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update user basic info successfully', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.update as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Updated User',
      email: 'updated@example.com',
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
            name: ['Updated User'],
            email: ['updated@example.com'],
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
    const req = {
      method: 'PUT',
      query: { userId: 'user-123' },
    } as any

    await handler(req, res)
    await parseCompleted

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({
      id: 'user-1',
      name: 'Updated User',
      email: 'updated@example.com',
      avatarUrl: null,
    })
    expect(bcrypt.hash).not.toHaveBeenCalled()
  })

  it('should update user with new avatar successfully', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.update as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: 'data:image/jpeg;base64,newfilecontent',
    })
    ;(fs.promises.readFile as jest.Mock).mockResolvedValue(
      Buffer.from('newfilecontent'),
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
          },
          {
            avatarUrl: [
              {
                filepath: '/tmp/newavatar.jpg',
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
    const req = {
      method: 'PUT',
      query: { userId: 'user-123' },
    } as any

    await handler(req, res)
    await parseCompleted

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: 'data:image/jpeg;base64,newfilecontent',
    })
    expect(fs.promises.readFile).toHaveBeenCalledWith('/tmp/newavatar.jpg')
    expect(fs.promises.unlink).toHaveBeenCalledWith('/tmp/newavatar.jpg')
  })

  it('should remove avatar when removeAvatar is true', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.update as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: null, // Avatar removido
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
            removeAvatar: ['true'],
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
    const req = {
      method: 'PUT',
      query: { userId: 'user-123' },
    } as any

    await handler(req, res)
    await parseCompleted

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: null,
    })
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: {
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: null,
      },
    })
  })

  it('should update password when provided', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })
    ;(prisma.user.update as jest.Mock).mockResolvedValue({
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
            password: ['newpassword123'],
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
    const req = {
      method: 'PUT',
      query: { userId: 'user-123' },
    } as any

    await handler(req, res)
    await parseCompleted

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(200)
    expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10)
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      },
    })
  })

  it('should return error 403 if user is not logged in', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const res = { status } as any
    const req = {
      method: 'PUT',
      query: { userId: 'user-123' },
    } as any

    await handler(req, res)

    expect(status).toHaveBeenCalledWith(403)
    expect(json).toHaveBeenCalledWith({
      message: 'You must be logged in to update your profile.',
    })
  })

  it('should return error if avatar is larger than 2MB', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
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
          },
          {
            avatarUrl: [
              {
                filepath: '/tmp/largeavatar.jpg',
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
    const req = {
      method: 'PUT',
      query: { userId: 'user-123' },
    } as any

    await handler(req, res)
    await parseCompleted

    await new Promise(process.nextTick)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({
      message: 'Image must be a maximum of 2MB!',
    })
  })
})
