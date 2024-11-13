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
  UserLibraryHeader,
  UserDetailsContainer,
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

  const { isValidatingLibraryPage, handleFetchBooksByStatus, handleSetUserId } =
    useAppContext()

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const isMobile = useScreenSize(768)

  const loadBooksStatus = async () => {
    const data = await handleFetchBooksByStatus(userId)

    setBooksStatus(data?.booksByStatus)
    setUserInfo(data?.userInfo)
  }

  useEffect(() => {
    if (userId) {
      handleSetUserId(userId)
      loadBooksStatus()
    }
  }, [userId])

  return (
    <>
      <NextSeo title="Profile | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <UserLibraryPageWrapper>
          {isMobile ? (
            <UserLibraryHeader>
              <MobileHeader />
            </UserLibraryHeader>
          ) : (
            <Sidebar />
          )}
          {openLateralMenu && (
            <LateralMenu
              book={selectedBook}
              onCloseWithoutUpdate={() => setOpenLateralMenu(false)}
              onClose={async () => {
                setOpenLateralMenu(false)
                await loadBooksStatus()
              }}
            />
          )}
          <UserLibraryBody>
            <UserLibraryHeading>
              <UserLibraryHeadingTitle>
                <Books />
                <h2>My Library</h2>
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
                  onSelect={(book: BookProps) => {
                    setSelectedBook(book)
                    setOpenLateralMenu(true)
                  }}
                />
              )}
              <UserDetailsContainer>
                <SubmittedBooksSection
                  userInfo={userInfo}
                  userId={userId}
                  onOpenDetails={(book: BookProps) => {
                    setSelectedBook(book)
                    setOpenLateralMenu(true)
                  }}
                />
              </UserDetailsContainer>
            </UserLibraryContent>
          </UserLibraryBody>
        </UserLibraryPageWrapper>
      )}
    </>
  )
}
