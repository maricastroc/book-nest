import { BookProps } from './book'
import { UserProps } from './user'

export interface RatingProps {
  id: string
  rate: number
  description: string
  createdAt: Date

  book: BookProps
  bookId: string

  user: UserProps
  userId: string
}
