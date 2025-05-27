/* eslint-disable react-hooks/exhaustive-deps */
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { MagnifyingGlass, User, X } from 'phosphor-react'
import { useRouter } from 'next/router'

import { Sidebar } from '@/components/shared/Sidebar'
import { ProfileCard } from '@/pages/profile/partials/ProfileCard'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { UserDetails } from '@/pages/profile/partials/UserDetails'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { Pagination } from '@/components/shared/Pagination'

import { useScreenSize } from '@/hooks/useScreenSize'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import useRequest from '@/hooks/useRequest'
import { useProfileRatings } from '@/hooks/useProfileRatings'

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
  UserRatingsTitle,
} from './styles'

import { RatingProps } from '@/@types/rating'
import { UserStatistics } from '@/@types/user_statistics'

export default function Profile() {
  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const isRouteLoading = useLoadingOnRouteChange()

  const isSmallSize = useScreenSize(480)

  const isMediumSize = useScreenSize(768)

  const [userStatistics, setUserStatistics] = useState<
    UserStatistics | undefined
  >(undefined)

  const {
    ratings: userRatings,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    isValidatingRatings,
    mutateRatings,
    onCreateReview,
    onDeleteReview,
    onUpdateReview,
  } = useProfileRatings(userId)

  const userStatisticsRequest = userId
    ? {
        url: `/profile/statistics/${userId}`,
        method: 'GET',
      }
    : null

  const {
    data: userStatisticsData,
    mutate: mutateStatistics,
    isValidating: isValidatingStatistics,
  } = useRequest<UserStatistics>(userStatisticsRequest)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (userId) {
      mutateStatistics()
      mutateRatings()
    }
  }, [userId])

  useEffect(() => {
    if (userStatisticsData) {
      setUserStatistics(userStatisticsData)
    }
  }, [userStatisticsData])

  return (
    <>
      <NextSeo title="Profile | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <ProfilePageWrapper>
          {isSmallSize || isMediumSize ? <MobileHeader /> : <Sidebar />}
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
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setCurrentPage(1)
                    }}
                    spellCheck={false}
                  />
                  {search === '' ? (
                    <MagnifyingGlass />
                  ) : (
                    <X
                      onClick={() => {
                        setSearch('')
                        setCurrentPage(1)
                      }}
                    />
                  )}
                </SearchBar>
                <UserRatings
                  className={`${
                    isValidatingRatings || userRatings?.length > 0
                      ? 'with_padding_right'
                      : ''
                  }`}
                >
                  {isValidatingRatings ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <SkeletonRatingCard key={index} />
                    ))
                  ) : userRatings?.length > 0 ? (
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
                    })
                  ) : (
                    <EmptyContainer content="ratings" />
                  )}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </UserRatings>
              </UserRatingsContainer>

              <UserDetailsContainer>
                <UserDetails
                  userStatistics={userStatistics}
                  userId={userId}
                  isLoading={isValidatingStatistics}
                />
              </UserDetailsContainer>
            </ProfilePageContent>
          </ProfilePageContainer>
        </ProfilePageWrapper>
      )}
    </>
  )
}
