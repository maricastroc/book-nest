/* eslint-disable react-hooks/exhaustive-deps */
import { NextSeo } from 'next-seo'

import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { Books } from 'phosphor-react'

import {
  UserLibraryContent,
  UserLibraryHeading,
  UserLibraryHeadingTitle,
  UserLibraryBody,
  UserLibraryPageWrapper,
  SubmittedBooksContainer,
  ListByBookStatusContainer,
} from './styles'

import { Sidebar } from '@/components/shared/Sidebar'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { BookStatusListContainer } from '../partials/BookStatusListContainer'
import { SubmittedBooksSection } from '../partials/SubmittedBooksSection'
import { SkeletonBookStatusList } from '@/pages/library/partials/SkeletonBookStatusList'

import { BookProps } from '@/@types/book'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { useUserLibraryData } from '@/hooks/useUserLibraryData'
import { useScreenSize } from '@/hooks/useScreenSize'

export interface UserInfo {
  avatarUrl: string
  name: string
  id: string
}

export default function Library() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  const {
    submittedBooks,
    booksByStatus,
    userInfo,
    isValidatingSubmittedBooksData,
    isValidatingBooksByStatusData,
    isLoggedUser,
    userName,
    onUpdateSubmittedBook,
    onUpdateBookByStatus,
  } = useUserLibraryData(userId)

  const libraryTitle = useMemo(() => {
    if (!userInfo) return 'Library'
    if (isLoggedUser) return 'My Library'
    return `${userName}'s Library`
  }, [userInfo, isLoggedUser, userName])

  const renderBookStatusSection = useCallback(() => {
    if (isValidatingBooksByStatusData) {
      return (
        <ListByBookStatusContainer>
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBookStatusList key={index} />
          ))}
        </ListByBookStatusContainer>
      )
    }

    return (
      <BookStatusListContainer
        data={booksByStatus}
        userInfo={userInfo as UserInfo}
        onSelect={(book: BookProps) => {
          setSelectedBook(book)
          setOpenLateralMenu(true)
        }}
      />
    )
  }, [isValidatingBooksByStatusData, booksByStatus, userInfo])

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
                <h2>{libraryTitle}</h2>
              </UserLibraryHeadingTitle>
            </UserLibraryHeading>

            <UserLibraryContent>
              {renderBookStatusSection()}
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
