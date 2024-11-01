import { CategoriesOnBooks } from '@prisma/client'
import { RatingProps } from './rating'
import { UserProps } from './user'

export interface BookProps {
  id: string
  name: string
  author: string
  summary: string
  coverUrl: string
  totalPages: number
  createdAt: Date

  userId?: string | null
  user?: UserProps | null | undefined

  categories?: CategoriesOnBooks[]
  rate: number
  alreadyRead?: boolean
  ratings?: RatingProps[]
}
