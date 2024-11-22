import { BookProps } from './book'

export interface BooksByStatusProps {
  read: BookProps[] | undefined
  reading: BookProps[] | undefined
  want_to_read: BookProps[] | undefined
  did_not_finish: BookProps[] | undefined
}
