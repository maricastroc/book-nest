import { AccountProps } from './account'
import { BookProps } from './book'
import { RatingProps } from './rating'
import { SessionProps } from './session'

export interface UserProps {
  id: string
  name: string
  avatarUrl?: string | null | undefined
  createdAt: Date
  password?: string | null

  accounts?: AccountProps[] | null | undefined
  sessions?: SessionProps[] | null | undefined
  ratings?: RatingProps[] | null | undefined
  books?: BookProps[] | null | undefined
}
