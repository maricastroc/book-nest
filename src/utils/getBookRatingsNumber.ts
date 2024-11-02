import { BookProps } from '@/@types/book'

export const getBookRatingsNumber = (book: BookProps) => {
  if (book?.ratings) {
    return book.ratings.length === 1
      ? `(1 rating)`
      : `(${book.ratings.length} ratings)`
  }
  return null
}
