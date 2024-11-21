/* eslint-disable react-hooks/exhaustive-deps */
import { MobileHeader } from '@/components/shared/MobileHeader'
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
import { BooksStatusProps } from '@/@types/books-status'
import { SkeletonBookStatusList } from '@/pages/library/partials/SkeletonBookStatusList'

import { useEffect, useState } from 'react'
import { BookProps } from '@/@types/book'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { BookStatusListContainer } from '../partials/BookStatusListContainer'
import { SubmittedBooksSection } from '../partials/SubmittedBooksSection'
import { MobileFooter } from '@/components/shared/MobileFooter'
import { TabletHeader } from '@/components/shared/TabletHeader'

export interface UserInfo {
  avatarUrl: string
  name: string
  id: string
}

export default function Profile() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const [booksStatus, setBooksStatus] = useState<BooksStatusProps | undefined>()

  const [userInfo, setUserInfo] = useState<UserInfo | undefined>()

  const { loggedUser } = useAppContext()

  const isLoggedUser = loggedUser?.id.toString() === userInfo?.id.toString()

  const userName = userInfo?.name?.split(' ')[0] || ''

  const { isValidatingLibraryPage, handleFetchBooksByStatus, handleSetUserId } =
    useAppContext()

  const [submittedBooks, setSubmittedBooks] = useState<
    BookProps[] | undefined
  >()

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  const loadBooksByStatus = async () => {
    const books = await handleFetchBooksByStatus(userId)

    setBooksStatus(books?.booksByStatus)
    setUserInfo(books?.userInfo)
    setSubmittedBooks(books?.submittedBooks)
  }

  useEffect(() => {
    if (userId) {
      handleSetUserId(userId)
      loadBooksByStatus()
    }
  }, [userId])

  return (
    <>
      <NextSeo title="Profile | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <UserLibraryPageWrapper>
          {isSmallSize ? (
            <MobileHeader />
          ) : isMediumSize ? (
            <TabletHeader />
          ) : (
            <Sidebar />
          )}
          {openLateralMenu && selectedBook && (
            <LateralMenu
              bookId={selectedBook.id}
              onCloseWithoutUpdate={() => setOpenLateralMenu(false)}
              onClose={async () => {
                setOpenLateralMenu(false)
                await loadBooksByStatus()
              }}
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
              {isValidatingLibraryPage ? (
                <ListByBookStatusContainer>
                  {Array.from({ length: 3 }, (_, index) => (
                    <SkeletonBookStatusList key={index} />
                  ))}
                </ListByBookStatusContainer>
              ) : (
                <BookStatusListContainer
                  data={booksStatus}
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
                  onUpdate={async () => {
                    await loadBooksByStatus()
                  }}
                  userId={userId}
                  userInfo={userInfo}
                  onOpenDetails={(book: BookProps) => {
                    setSelectedBook(book)
                    setOpenLateralMenu(true)
                  }}
                />
              </SubmittedBooksContainer>
            </UserLibraryContent>
          </UserLibraryBody>
          {isSmallSize && <MobileFooter />}
        </UserLibraryPageWrapper>
      )}
    </>
  )
}
