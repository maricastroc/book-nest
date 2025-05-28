/* eslint-disable react-hooks/exhaustive-deps */
import { NextSeo } from 'next-seo'
import { Sidebar } from '@/components/shared/Sidebar'
import {
  UserLibraryContent,
  UserLibraryHeading,
  UserLibraryHeadingTitle,
  UserLibraryBody,
  UserLibraryPageWrapper,
  SubmittedBooksContainer,
  ListByBookStatusContainer,
} from './styles'
import { Books } from 'phosphor-react'
import { useScreenSize } from '@/hooks/useScreenSize'
import { useRouter } from 'next/router'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { useAppContext } from '@/contexts/AppContext'
import { BooksByStatusProps } from '@/@types/books-status'
import { SkeletonBookStatusList } from '@/pages/library/partials/SkeletonBookStatusList'

import { useEffect, useState } from 'react'
import { BookProps } from '@/@types/book'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { BookStatusListContainer } from '../partials/BookStatusListContainer'
import { SubmittedBooksSection } from '../partials/SubmittedBooksSection'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import useRequest from '@/hooks/useRequest'
import { UserProps } from '@/@types/user'

export interface UserInfo {
  avatarUrl: string
  name: string
  id: string
}

export default function Library() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const [booksByStatus, setBooksByStatus] = useState<
    BooksByStatusProps | undefined
  >()

  const [userInfo, setUserInfo] = useState<UserInfo | undefined>()

  const { loggedUser } = useAppContext()

  const isLoggedUser = loggedUser?.id.toString() === userInfo?.id.toString()

  const userName = userInfo?.name?.split(' ')[0] || ''

  const [submittedBooks, setSubmittedBooks] = useState<BookProps[]>()

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

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
  } = useRequest<{
    submittedBooks: BookProps[]
    user: UserProps
  }>(submittedBooksRequest)

  const {
    data: booksByStatusData,
    isValidating: isValidatingBooksByStatusData,
  } = useRequest<{
    booksByStatus: BooksByStatusProps
  }>(booksByStatusRequest)

  const onUpdateSubmittedBook = (book: BookProps) => {
    setSubmittedBooks((prevBooks) => {
      if (!prevBooks) return [book]

      const bookExists = prevBooks.some((b) => b.id === book.id)

      if (!bookExists) {
        return [...prevBooks, book]
      }

      return prevBooks.map((b) => (b.id === book.id ? book : b))
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

  useEffect(() => {
    if (submittedBooksData) {
      setSubmittedBooks(submittedBooksData.submittedBooks)
      setUserInfo(submittedBooksData.user as UserInfo)
    }
  }, [submittedBooksData])

  useEffect(() => {
    if (booksByStatusData) {
      setBooksByStatus(booksByStatusData.booksByStatus)
    }
  }, [booksByStatusData])

  return (
    <>
      <NextSeo
        title="Library | Book Wise"
        additionalMetaTags={[
          {
            name: 'viewport',
            content:
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
          },
        ]}
      />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <UserLibraryPageWrapper>
          {isSmallSize || isMediumSize ? <MobileHeader /> : <Sidebar />}
          {openLateralMenu && selectedBook && (
            <LateralMenu
              bookId={selectedBook.id}
              onUpdateBook={(book) => {
                onUpdateBookByStatus(book)
                onUpdateSubmittedBook(book)
              }}
              onClose={() => setOpenLateralMenu(false)}
            />
          )}
          <UserLibraryBody>
            <UserLibraryHeading>
              <UserLibraryHeadingTitle>
                <Books />
                <h2>
                  {!userInfo
                    ? 'Library'
                    : isLoggedUser
                    ? 'My Library'
                    : `${userName}'s Library`}
                </h2>
              </UserLibraryHeadingTitle>
            </UserLibraryHeading>

            <UserLibraryContent>
              {isValidatingBooksByStatusData ? (
                <ListByBookStatusContainer>
                  {Array.from({ length: 3 }, (_, index) => (
                    <SkeletonBookStatusList key={index} />
                  ))}
                </ListByBookStatusContainer>
              ) : (
                <BookStatusListContainer
                  data={booksByStatus}
                  userInfo={userInfo}
                  onSelect={(book: BookProps) => {
                    setSelectedBook(book)
                    setOpenLateralMenu(true)
                  }}
                />
              )}
              <SubmittedBooksContainer>
                <SubmittedBooksSection
                  submittedBooks={submittedBooks}
                  userId={userId}
                  userInfo={userInfo}
                  onUpdateBook={(book) => {
                    onUpdateBookByStatus(book)
                    onUpdateSubmittedBook(book)
                  }}
                  isValidating={isValidatingSubmittedBooksData}
                />
              </SubmittedBooksContainer>
            </UserLibraryContent>
          </UserLibraryBody>
        </UserLibraryPageWrapper>
      )}
    </>
  )
}
