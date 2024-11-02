import { BookProps } from '@/@types/book'

export const getBookTitle = (book: BookProps) => {
  const bookTitle = book?.publishingYear
    ? `${book.name} (${book.publishingYear})`
    : book.name

  return bookTitle
}
