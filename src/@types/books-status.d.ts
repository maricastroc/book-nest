import { BookProps } from './book'

export interface BooksStatusProps {
  read: BookProps[] | undefined
  reading: BookProps[] | undefined
  want_to_read: BookProps[] | undefined
  did_not_finish: BookProps[] | undefined
}
