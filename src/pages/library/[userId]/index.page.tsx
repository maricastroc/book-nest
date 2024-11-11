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
import useRequest from '@/utils/useRequest'
import { useAppContext } from '@/contexts/AppContext'
import { BooksStatusProps } from '@/@types/books-status'
import { SkeletonStatusBox } from '@/components/skeletons/SkeletonStatusBox'

import { useState } from 'react'
import { BookProps } from '@/@types/book'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { toast } from 'react-toastify'
import { CreateReviewData, EditReviewData } from '@/pages/home/index.page'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { BookStatusListContainer } from '../partials/BookStatusListContainer'
import { SubmittedBooksSection } from '../partials/SubmittedBooksSection'

export default function Profile() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const { loggedUser } = useAppContext()

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const {
    data: userBooks,
    isValidating: isValidatingUserBooks,
    mutate: mutateUserBooks,
  } = useRequest<BookProps[]>({
    url: `/profile/books`,
    method: 'GET',
  })

  const requestBooksStatus = userId
    ? {
        url: `/library`,
        method: 'GET',
        params: { userId },
      }
    : null

  const {
    data: booksStatus,
    isValidating: isValidatingBooksStatus,
    mutate: mutateBooksStatus,
  } = useRequest<BooksStatusProps>(requestBooksStatus)

  const isMobile = useScreenSize(768)

  const handleDeleteReview = async (id: string) => {
    try {
      const payload = { id }

      await Promise.all([
        api.delete('/ratings', { data: payload }),
        mutateBooksStatus(),
        mutateUserBooks(),
      ])

      toast.success('Rating successfully deleted!')
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleEditReview = async (data: EditReviewData) => {
    try {
      const payload = {
        id: data.ratingId,
        description: data.description,
        rate: data.rate,
      }

      await Promise.all([
        await api.put('/ratings', payload),
        mutateBooksStatus(),
        mutateUserBooks(),
      ])

      toast.success('Rating successfully edited!')
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreateReview = async (data: CreateReviewData) => {
    try {
      const payload = {
        bookId: data.bookId,
        userId: data.userId,
        description: data.description,
        rate: data.rate,
      }

      await Promise.all([
        await api.post(`/ratings`, { data: payload }),
        mutateBooksStatus(),
        mutateUserBooks(),
      ])

      toast.success('Rating successfully submitted!')
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleSelectReadingStatus = async (book: BookProps, status: string) => {
    if (loggedUser && book) {
      try {
        const payload = {
          userId: loggedUser?.id,
          bookId: book.id,
          status,
        }

        await Promise.all([
          api.post('/reading_status', payload),
          mutateBooksStatus(),
          mutateUserBooks(),
        ])

        toast.success('Status successfully updated!')
      } catch (error) {
        handleApiError(error)
      }
    }
  }

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
              handleDeleteReview={handleDeleteReview}
              handleCreateReview={handleCreateReview}
              handleEditReview={handleEditReview}
              handleSelectReadingStatus={handleSelectReadingStatus}
              book={selectedBook}
              onClose={() => setOpenLateralMenu(false)}
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
              {isValidatingBooksStatus ? (
                <ListByBookStatusContainer>
                  {Array.from({ length: 3 }, (_, index) => (
                    <SkeletonStatusBox key={index} />
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
                  onOpenDetails={(book: BookProps) => {
                    setSelectedBook(book)
                    setOpenLateralMenu(true)
                  }}
                  mutate={mutateUserBooks}
                  userBooks={userBooks}
                  isValidating={isValidatingUserBooks}
                />
              </UserDetailsContainer>
            </UserLibraryContent>
          </UserLibraryBody>
        </UserLibraryPageWrapper>
      )}
    </>
  )
}
