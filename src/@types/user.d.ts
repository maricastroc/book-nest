import { AccountProps } from './account'
import { BookProps } from './book'
import { RatingProps } from './rating'
import { SessionProps } from './session'

export interface UserProps {
  id: string | number
  name: string
  avatarUrl?: string | null | undefined
  createdAt: string
  password?: string | null
  email?: string

  accounts?: AccountProps[] | null | undefined
  sessions?: SessionProps[] | null | undefined
  ratings?: RatingProps[] | null | undefined
  books?: BookProps[] | null | undefined
}
