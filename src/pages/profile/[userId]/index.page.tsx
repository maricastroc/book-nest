/* eslint-disable react-hooks/exhaustive-deps */
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
import { useAppContext, UserStatistics } from '@/contexts/AppContext'
import { TabletHeader } from '@/components/shared/TabletHeader'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'

export default function Profile() {
  const isRouteLoading = useLoadingOnRouteChange()

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const [userStatistics, setUserStatistics] = useState<
    UserStatistics | undefined
  >(undefined)

  const [userRatings, setUserRatings] = useState<RatingProps[]>([])

  const [search, setSearch] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const { handleSetUserId } = useAppContext()

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  const handleFetchUserStatistics = async (
    userId: string | undefined,
    search: string | undefined,
  ) => {
    try {
      setIsLoading(true)

      const response = await api.get(`/profile/${userId}`, {
        params: { search },
      })
      return response.data.profile
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onUpdateReview = async (updatedReview: RatingProps) => {
    setUserRatings((prevRatings) =>
      prevRatings.map((rating) =>
        rating.id === updatedReview.id
          ? {
              ...rating,
              rate: updatedReview.rate,
              description: updatedReview.description,
            }
          : rating,
      ),
    )
  }

  const onCreateReview = (newRating: RatingProps) => {
    setUserRatings((prevRatings) => [...(prevRatings || []), newRating])
  }

  const onDeleteReview = (ratingId: string) => {
    setUserRatings((prevRatings) =>
      prevRatings?.filter((rating) => rating.id !== ratingId),
    )
  }

  useEffect(() => {
    if (userStatistics) {
      setUserRatings(userStatistics.ratings ?? [])
    }
  }, [userStatistics])

  const loadUserStatistics = async () => {
    setIsLoading(true)

    const data = await handleFetchUserStatistics(userId, search)

    if (data) {
      setUserStatistics(data)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (userId) {
      handleSetUserId(userId)
      loadUserStatistics()
    }
  }, [userId, search])

  return (
    <>
      <NextSeo title="Profile | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <ProfilePageWrapper>
          {isSmallSize || isMediumSize ? <TabletHeader /> : <Sidebar />}
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
                {!userStatistics?.ratings?.length && !isLoading && (
                  <EmptyWrapper>
                    <EmptyContainer />
                  </EmptyWrapper>
                )}
                <UserRatings
                  className={
                    isLoading || (userRatings?.length ?? 0) > 1 ? 'smaller' : ''
                  }
                >
                  {isLoading
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
                              onUpdateReview={onUpdateReview}
                              onCreateReview={onCreateReview}
                              onDeleteReview={onDeleteReview}
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
                    isLoading={isLoading}
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
