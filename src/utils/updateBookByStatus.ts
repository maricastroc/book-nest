import { BookProps } from '@/@types/book'
import { BooksByStatusProps } from '@/@types/books-status'
import { formatToSnakeCase } from './formatToSnakeCase'

interface Props {
  updatedBook: BookProps
  setBooksByStatus: (
    updater: (prevStatus: BooksByStatusProps) => BooksByStatusProps,
  ) => void
}

export const updateBookByStatus = ({
  updatedBook,
  setBooksByStatus,
}: Props) => {
  setBooksByStatus((prevStatus) => {
    if (!prevStatus) return prevStatus

    const oldStatus = Object.keys(prevStatus).find((status) =>
      prevStatus[status as keyof BooksByStatusProps]?.some(
        (book) => book.id === updatedBook.id,
      ),
    ) as keyof BooksByStatusProps | undefined

    if (!updatedBook.readingStatus) {
      if (oldStatus) {
        return {
          ...prevStatus,
          [oldStatus]: prevStatus[oldStatus]?.filter(
            (book) => book.id !== updatedBook.id,
          ),
        }
      }
      return prevStatus
    }

    const newStatus = formatToSnakeCase(
      updatedBook.readingStatus,
    ) as keyof BooksByStatusProps

    if (!oldStatus) {
      return {
        ...prevStatus,
        [newStatus]: [...(prevStatus[newStatus] || []), updatedBook],
      }
    }

    if (oldStatus === newStatus) {
      return {
        ...prevStatus,
        [oldStatus]: prevStatus[oldStatus]?.map((book) =>
          book.id === updatedBook.id ? updatedBook : book,
        ),
      }
    }

    return {
      ...prevStatus,
      [oldStatus]: prevStatus[oldStatus]?.filter(
        (book) => book.id !== updatedBook.id,
      ),
      [newStatus]: [...(prevStatus[newStatus] || []), updatedBook],
    }
  })
}
