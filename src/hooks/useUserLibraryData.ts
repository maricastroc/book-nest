import { useEffect, useState } from 'react'
import useRequest from '@/hooks/useRequest'
import { BookProps } from '@/@types/book'
import { BooksByStatusProps } from '@/@types/books-status'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'

export function useUserLibraryData(userId?: string) {
  const [booksByStatus, setBooksByStatus] = useState<BooksByStatusProps>()

  const booksByStatusRequest = userId
    ? {
        url: '/library/books_by_status',
        method: 'GET',
        params: { userId },
      }
    : null

  const {
    data: booksByStatusData,
    isValidating: isValidatingBooksByStatusData,
  } = useRequest<{ booksByStatus: BooksByStatusProps }>(booksByStatusRequest)

  useEffect(() => {
    if (booksByStatusData) {
      setBooksByStatus(booksByStatusData.booksByStatus)
    }
  }, [booksByStatusData])

  const onUpdateBookByStatus = (updatedBook: BookProps) => {
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

  return {
    booksByStatus,
    isValidatingBooksByStatusData,
    onUpdateBookByStatus,
  }
}
