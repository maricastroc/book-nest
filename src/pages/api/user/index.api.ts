import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (session) {
    return res.status(403).json({ message: 'You are already logged in.' })
  }

  const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .email('Invalid email')
      .nonempty('Email is required')
      .refine(
        async (email) => {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          })
          return !existingUser
        },
        { message: 'Email already exists.' },
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  })

  try {
    // Fazendo a validação
    const { name, email, password } = createUserSchema.parse(req.body)

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return res.status(201).json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message })
    }
    return res.status(500).json({ message: 'Internal server error' })
  }
}
