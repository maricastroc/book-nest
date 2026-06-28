import { NextApiRequest, NextApiResponse } from 'next'

// Typed factories for the partial request/response objects used across the API
// handler tests. They centralize the single unavoidable cast so individual
// tests stay free of `any` while keeping their existing mock shapes.

export const mockReq = (req: Partial<NextApiRequest>): NextApiRequest =>
  req as unknown as NextApiRequest

export const mockRes = (res: Record<string, unknown>): NextApiResponse =>
  res as unknown as NextApiResponse
