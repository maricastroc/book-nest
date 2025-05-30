/* eslint-disable react-hooks/exhaustive-deps */
import { BookProps } from '@/@types/book'
import { BookStatusListWrapper, Container } from './styles'
import { BooksByStatusProps } from '@/@types/books-status'
import { BookStatusList } from '../BookStatusList'
import { useAppContext } from '@/contexts/AppContext'
import { useEffect, useState } from 'react'
import { BooksGridByStatus } from '../BooksGridByStatus'
import { UserProps } from '@/@types/user'
import { getBookStatusList } from '@/utils/getBookStatusList'
import useRequest from '@/hooks/useRequest'
import { SkeletonBookStatusList } from '../SkeletonBookStatusList'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { getEmptyBoxMessage } from '@/utils/getEmptyBoxMessage'

interface BookStatusListContainerProps {
  userInfo: UserProps | null
  refreshKey: number
}

export function BookStatusListContainer({
  userInfo,
  refreshKey,
}: BookStatusListContainerProps) {
  const { loggedUser } = useAppContext()

  const isLoggedUser = loggedUser?.id.toString() === userInfo?.id.toString()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  const [selectedLabel, setSelectedLabel] = useState('')

  const [booksByStatus, setBooksByStatus] = useState<BooksByStatusProps>()

  const [selectedStatus, setSelectedStatus] = useState<
    'read' | 'reading' | 'want_to_read' | 'did_not_finish' | null
  >(null)

  const booksByStatusRequest = userInfo?.id
    ? {
        url: '/library/books_by_status',
        method: 'GET',
        params: { userId: userInfo.id },
      }
    : null

  const {
    data: booksByStatusData,
    mutate,
    isValidating: isValidatingBooksByStatusData,
  } = useRequest<{ booksByStatus: BooksByStatusProps }>(booksByStatusRequest)

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

  useEffect(() => {
    if (booksByStatusData) {
      setBooksByStatus(booksByStatusData.booksByStatus)
    }
  }, [booksByStatusData])

  useEffect(() => {
    mutate()
  }, [refreshKey])

  return selectedStatus ? (
    <BooksGridByStatus
      setSelectedStatus={(value) => setSelectedStatus(value)}
      setSelectedLabel={(value) => setSelectedLabel(value as string)}
      selectedLabel={selectedLabel}
      selectedStatus={selectedStatus}
      userId={userInfo?.id as string}
      refreshKey={refreshKey}
    />
  ) : (
    <Container>
      {isLateralMenuOpen && !!selectedBook && (
        <LateralMenu
          bookId={selectedBook.id}
          onUpdateBook={(book) => {
            onUpdateBookByStatus(book)
          }}
          onClose={() => setIsLateralMenuOpen(false)}
        />
      )}

      {isValidatingBooksByStatusData ? (
        Array.from({ length: 3 }, (_, index) => (
          <SkeletonBookStatusList key={index} />
        ))
      ) : (
        <BookStatusListWrapper>
          {getBookStatusList(booksByStatus).map(({ key, label, books }) => (
            <BookStatusList
              key={key}
              isLoggedUser={isLoggedUser}
              className={key}
              status={key}
              statusLabel={label}
              books={books}
              onSelect={(book) => {
                setIsLateralMenuOpen(true)
                setSelectedBook(book)
              }}
              emptyBoxMessage={getEmptyBoxMessage(key, userInfo, loggedUser)}
              onStatusClick={() => {
                setSelectedStatus(key)
                setSelectedLabel(label)
              }}
            />
          ))}
        </BookStatusListWrapper>
      )}
    </Container>
  )
}
