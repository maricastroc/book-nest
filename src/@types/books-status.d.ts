import { BookProps } from './book'

export interface BooksByStatusProps {
  read: BookProps[] | undefined
  reading: BookProps[] | undefined
  wantToRead: BookProps[] | undefined
  didNotFinish: BookProps[] | undefined
}
