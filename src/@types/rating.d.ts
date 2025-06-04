import { BookProps } from './book'
import { UserProps } from './user'

export interface RatingProps {
  id: string
  rate: number
  description?: string | undefined
  createdAt: Date

  book?: BookProps | undefined
  bookId: string

  user: UserProps
  userId: string

  deletedAt: Date | null

  updated_votes_up?: number
  updated_votes_down?: number

  votes: {
    up: number
    down: number
    userVote?: 'UP' | 'DOWN' | null
  }
}
