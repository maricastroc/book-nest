/* eslint-disable react-hooks/exhaustive-deps */
import { MobileHeader } from '@/components/shared/MobileHeader'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/shared/Sidebar'
import {
  UserRatings,
  UserRatingsContainer,
  ProfilePageContent,
  ProfilePageHeading,
  ProfilePageHeadingTitle,
  ProfilePageContainer,
  SearchBar,
  UserDetailsContainer,
  ProfilePageWrapper,
  EmptyWrapper,
  UserRatingsTitle,
} from './styles'
import { MagnifyingGlass, User, X } from 'phosphor-react'
import { ProfileCard } from '@/pages/profile/partials/ProfileCard'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { UserDetails } from '@/pages/profile/partials/UserDetails'
import { RatingProps } from '@/@types/rating'
import { useScreenSize } from '@/utils/useScreenSize'
import { useRouter } from 'next/router'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import useRequest from '@/utils/useRequest'
import { UserStatistics } from '@/contexts/AppContext'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { handleApiError } from '@/utils/handleApiError'
import { EditReviewData } from '@/pages/home/index.page'

export default function Profile() {
  const isRouteLoading = useLoadingOnRouteChange()

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const [search, setSearch] = useState('')

  const [userRatings, setUserRatings] = useState<RatingProps[]>([])

  const requestConfig = userId
    ? {
        url: `/profile/${userId}`,
        method: 'GET',
        params: { search },
      }
    : null

  const {
    data: userStatistics,
    isValidating,
    mutate,
  } = useRequest<UserStatistics>(requestConfig)

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

  useEffect(() => {
    if (userStatistics) {
      setUserRatings(userStatistics.ratings ?? [])
    }
  }, [userStatistics])

  return (
    <>
      <NextSeo title="Profile | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <ProfilePageWrapper>
          {isMobile ? <MobileHeader /> : <Sidebar />}
          <ProfilePageContainer>
            <ProfilePageHeading>
              <ProfilePageHeadingTitle>
                <User />
                <h2>Profile</h2>
              </ProfilePageHeadingTitle>
            </ProfilePageHeading>
            <ProfilePageContent>
              <UserRatingsContainer>
                <UserRatingsTitle>User&apos;s Reviews</UserRatingsTitle>
                <SearchBar>
                  <input
                    type="text"
                    placeholder="Search for author or title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    spellCheck={false}
                  />
                  {search === '' ? (
                    <MagnifyingGlass />
                  ) : (
                    <X onClick={() => setSearch('')} />
                  )}
                </SearchBar>
                {!userStatistics?.ratings?.length && !isValidating && (
                  <EmptyWrapper>
                    <EmptyContainer />
                  </EmptyWrapper>
                )}
                <UserRatings
                  className={
                    isValidating || (userRatings?.length ?? 0) > 1
                      ? 'smaller'
                      : ''
                  }
                >
                  {isValidating
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonRatingCard key={index} />
                      ))
                    : userRatings?.length > 0 &&
                      userRatings.map((rating: RatingProps) => {
                        if (rating?.book) {
                          return (
                            <ProfileCard
                              key={rating.id}
                              book={rating.book}
                              rating={rating}
                              handleDeleteReview={async () => {
                                await handleDeleteReview(rating.id)
                              }}
                              handleEditReview={async (
                                data: EditReviewData,
                              ) => {
                                await handleEditReview(data)
                              }}
                            />
                          )
                        }
                        return null
                      })}
                </UserRatings>
              </UserRatingsContainer>

              <UserDetailsContainer>
                {userId && (
                  <UserDetails
                    userStatistics={userStatistics}
                    userId={userId as string}
                  />
                )}
              </UserDetailsContainer>
            </ProfilePageContent>
          </ProfilePageContainer>
        </ProfilePageWrapper>
      )}
    </>
  )
}
