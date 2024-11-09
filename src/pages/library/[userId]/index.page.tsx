import { MobileHeader } from '@/components/shared/MobileHeader'
import { NextSeo } from 'next-seo'
import { Sidebar } from '@/components/shared/Sidebar'
import {
  LibraryPageContent,
  LibraryPageHeading,
  LibraryPageHeadingTitle,
  LibraryPageContainer,
  LibraryPageWrapper,
  LibraryHeaderWrapper,
  UserDetailsContainer,
  StatusBoxesContainer,
} from './styles'
import { Books } from 'phosphor-react'
import { UserDetails } from '@/components/UserDetails'
import { useScreenSize } from '@/utils/useScreenSize'
import { useRouter } from 'next/router'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import useRequest from '@/utils/useRequest'
import { UserStatistics } from '@/contexts/AppContext'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { handleApiError } from '@/utils/handleApiError'
import { EditReviewData } from '@/pages/home/index.page'
import { BooksStatusProps } from '@/@types/books-status'
import { SkeletonStatusBox } from '@/components/skeletons/SkeletonStatusBox'
import { StatusBoxes } from '../partials/StatusBoxes'

export default function Profile() {
  const isRouteLoading = useLoadingOnRouteChange()

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const requestUserStatistics = userId
    ? {
        url: `/profile/${userId}`,
        method: 'GET',
      }
    : null

  const { data: userStatistics, mutate } = useRequest<UserStatistics>(
    requestUserStatistics,
  )

  const requestBooksStatus = userId
    ? {
        url: `/library`,
        method: 'GET',
      }
    : null

  const { data: booksStatus, isValidating: isValidatingBooksStatus } =
    useRequest<BooksStatusProps>(requestBooksStatus)

  const handleDeleteReview = async (id: string) => {
    try {
      const payload = { id }
      await api.delete('/ratings', { data: payload })

      toast.success('Rating successfully deleted!')

      await mutate()
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

      await api.put('/ratings', payload)

      toast.success('Rating successfully edited!')

      await mutate()
    } catch (error) {
      handleApiError(error)
    }
  }

  const isMobile = useScreenSize(768)

  return (
    <>
      <NextSeo title="Profile | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <LibraryPageWrapper>
          {isMobile ? (
            <LibraryHeaderWrapper>
              <MobileHeader />
            </LibraryHeaderWrapper>
          ) : (
            <Sidebar />
          )}
          <LibraryPageContainer>
            <LibraryPageHeading>
              <LibraryPageHeadingTitle>
                <Books />
                <h2>My Library</h2>
              </LibraryPageHeadingTitle>
            </LibraryPageHeading>

            <LibraryPageContent>
              {isValidatingBooksStatus ? (
                <StatusBoxesContainer>
                  <SkeletonStatusBox count={4} />
                </StatusBoxesContainer>
              ) : (
                <StatusBoxes data={booksStatus} />
              )}

              <UserDetailsContainer>
                {userId && (
                  <UserDetails
                    userStatistics={userStatistics}
                    userId={userId as string}
                  />
                )}
              </UserDetailsContainer>
            </LibraryPageContent>
          </LibraryPageContainer>
        </LibraryPageWrapper>
      )}
    </>
  )
}
