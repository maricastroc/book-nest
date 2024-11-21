import { BookProps } from '@/@types/book'

export const getBookRatingsNumber = (book: BookProps) => {
  if (book?.ratingCount) {
    return book?.ratingCount === 1
      ? `(1 rating)`
      : `(${book?.ratingCount} ratings)`
  }
  return null
}
