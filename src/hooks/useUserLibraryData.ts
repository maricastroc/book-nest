import { useEffect, useState } from 'react'
import useRequest from '@/hooks/useRequest'
import { BookProps } from '@/@types/book'
import { UserProps } from '@/@types/user'
import { BooksByStatusProps } from '@/@types/books-status'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { useAppContext } from '@/contexts/AppContext'

export function useUserLibraryData(userId?: string) {
  const [submittedBooks, setSubmittedBooks] = useState<BookProps[]>()

  const [booksByStatus, setBooksByStatus] = useState<BooksByStatusProps>()

  const [userInfo, setUserInfo] = useState<UserProps>()

  const { loggedUser } = useAppContext()

  const submittedBooksRequest = userId
    ? {
        url: '/library/submitted_books',
        method: 'GET',
        params: { userId },
      }
    : null

  const booksByStatusRequest = userId
    ? {
        url: '/library/books_by_status',
        method: 'GET',
        params: { userId },
      }
    : null

  const {
    data: submittedBooksData,
    isValidating: isValidatingSubmittedBooksData,
  } = useRequest<{ submittedBooks: BookProps[]; user: UserProps }>(
    submittedBooksRequest,
  )

  const {
    data: booksByStatusData,
    isValidating: isValidatingBooksByStatusData,
  } = useRequest<{ booksByStatus: BooksByStatusProps }>(booksByStatusRequest)

  useEffect(() => {
    if (submittedBooksData) {
      setSubmittedBooks(submittedBooksData.submittedBooks)
      setUserInfo(submittedBooksData.user)
    }
  }, [submittedBooksData])

  useEffect(() => {
    if (booksByStatusData) {
      setBooksByStatus(booksByStatusData.booksByStatus)
    }
  }, [booksByStatusData])

  const onUpdateSubmittedBook = (book: BookProps) => {
    setSubmittedBooks((prevBooks) => {
      if (!prevBooks) return [book]
      const bookExists = prevBooks.some((b) => b.id === book.id)
      return bookExists
        ? prevBooks.map((b) => (b.id === book.id ? book : b))
        : [...prevBooks, book]
    })
  }

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

  const isLoggedUser = loggedUser?.id.toString() === userInfo?.id.toString()

  const userName = userInfo?.name?.split(' ')[0] || ''

  return {
    submittedBooks,
    booksByStatus,
    userInfo,
    isValidatingSubmittedBooksData,
    isValidatingBooksByStatusData,
    isLoggedUser,
    userName,
    onUpdateSubmittedBook,
    onUpdateBookByStatus,
  }
}
