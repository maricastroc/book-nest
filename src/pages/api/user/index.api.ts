import formidable from 'formidable'
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false, // Desativa o bodyParser padrão
  },
}

// Função auxiliar para garantir que obtemos um valor de string
const getSingleString = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] // Retorna o primeiro valor se for um array
  }
  if (typeof value === 'string') {
    return value // Retorna o valor se for uma string
  }
  throw new Error('Field is required') // Lança um erro se o valor for indefinido
}

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

  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error processing form' })
    }

    try {
      // Acessando os campos do formulário como strings
      const name = getSingleString(fields.name)
      const email = getSingleString(fields.email)
      const password = getSingleString(fields.password)
      const avatarFile = files.avatar?.[0] as formidable.File

      if (!avatarFile) {
        return res.status(400).json({ message: 'Avatar file is required.' }) // Verificação de arquivo
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

      // Validação
      createUserSchema.parse({ name, email, password })

      const hashedPassword = await bcrypt.hash(password, 10)

      // Armazenando a imagem
      const avatarPath = path.join(
        process.cwd(),
        'public',
        'uploads',
        avatarFile.originalFilename ?? '',
      )
      fs.renameSync(avatarFile.filepath, avatarPath) // Mover o arquivo para a pasta 'uploads'

      const user = await prisma.user.create({
        data: {
          name, // Aqui é uma string
          email, // Aqui é uma string
          password: hashedPassword,
          avatarUrl: `/uploads/${avatarFile.originalFilename}`, // Salve a URL do avatar
        },
      })

      return res.status(201).json(user)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message })
      } else if (error instanceof Error) {
        return res.status(400).json({ message: error.message }) // Mensagem de erro customizada
      }
      return res.status(500).json({ message: 'Internal server error' })
    }
  })
}
