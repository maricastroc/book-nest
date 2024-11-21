import { RatingProps } from './rating'
import { UserProps } from './user'
import { CategoryProps } from './category'
import { CategoriesOnBooks } from '@prisma/client'

export interface BookProps {
  id: string
  name: string
  author: string
  summary: string
  coverUrl: string
  totalPages: number
  createdAt: Date
  publishingYear?: string | null | undefined
  readingStatus?: string | null | undefined
  ratingCount?: number | null | undefined
  userRating?: number
  publisher?: string | null | undefined
  language?: string | null | undefined
  isbn?: string | null | undefined

  userId?: string | null
  user?: UserProps | null | undefined

  categories?: CategoryProps[] | CategoriesOnBooks[]
  rate?: number
  alreadyRead?: boolean
  ratings?: RatingProps[]
}
