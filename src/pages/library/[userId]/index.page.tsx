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
import { useScreenSize } from '@/utils/useScreenSize'
import { useRouter } from 'next/router'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
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
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'

export interface UserInfo {
  avatarUrl: string
  name: string
  id: string
}

export default function Profile() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const [booksByStatus, setBooksByStatus] = useState<
    BooksByStatusProps | undefined
  >()

  const [userInfo, setUserInfo] = useState<UserInfo | undefined>()

  const [isValidating, setIsValidating] = useState(false)

  const { loggedUser } = useAppContext()

  const isLoggedUser = loggedUser?.id.toString() === userInfo?.id.toString()

  const userName = userInfo?.name?.split(' ')[0] || ''

  const [submittedBooks, setSubmittedBooks] = useState<
    BookProps[] | undefined
  >()

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  const handleFetchBooksByStatus = async (userId: string | undefined) => {
    try {
      setIsValidating(true)

      const response = await api.get('/library', { params: { userId } })

      if (response?.data) {
        setBooksByStatus(response.data.booksByStatus)
        setSubmittedBooks(response.data.submittedBooks)
        setUserInfo(response.data.user)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsValidating(false)
    }
  }

  const onUpdateSubmittedBook = (updatedBook: BookProps) => {
    setSubmittedBooks((prevBooks) => {
      if (!prevBooks) return prevBooks

      const updatedBooks = prevBooks.map((book) =>
        book.id === updatedBook.id ? updatedBook : book,
      )

      return updatedBooks
    })
  }

  const onUpdateBookByStatus = (updatedBook: BookProps) => {
    setBooksByStatus((prevStatus) => {
      if (!prevStatus) return prevStatus

      const oldStatus = Object.keys(prevStatus).find((status) =>
        prevStatus[status as keyof BooksByStatusProps]?.some(
          (book) => book.id === updatedBook.id,
        ),
      ) as keyof BooksByStatusProps

      if (!oldStatus) return prevStatus

      const newStatus = formatToSnakeCase(
        updatedBook?.readingStatus,
      ) as keyof BooksByStatusProps
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
    if (userId) {
      handleFetchBooksByStatus(userId)
    }
  }, [userId])

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
              onUpdateBook={(book: BookProps) => {
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
              {isValidating ? (
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
                  isValidating={isValidating}
                  onOpenDetails={(book: BookProps) => {
                    setSelectedBook(book)
                    setOpenLateralMenu(true)
                  }}
                />
              </SubmittedBooksContainer>
            </UserLibraryContent>
          </UserLibraryBody>
        </UserLibraryPageWrapper>
      )}
    </>
  )
}
