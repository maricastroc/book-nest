/* eslint-disable react-hooks/exhaustive-deps */
import { MobileHeader } from '@/components/MobileHeader'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
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
import { ProfileCard } from '@/components/ProfileCard'
import { EmptyContainer } from '@/components/EmptyContainer'
import { UserDetails } from '@/components/UserDetails'
import { RatingProps } from '@/@types/rating'
import { useScreenSize } from '@/utils/useScreenSize'
import { useRouter } from 'next/router'
import { SkeletonRatingCard } from '@/components/SkeletonRatingCard'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/LoadingPage'
import useRequest from '@/utils/useRequest'
import { UserStatistics } from '@/contexts/AppContext'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'

export default function Profile() {
  const isRouteLoading = useLoadingOnRouteChange()

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const [search, setSearch] = useState('')

  const [allRatings, setAllRatings] = useState<RatingProps[]>([])

  const [filteredRatings, setFilteredRatings] = useState<RatingProps[]>([])

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
      toast.error('Error deleting rating.')
      console.error(error)
    }
  }

  const isMobile = useScreenSize(768)

  useEffect(() => {
    if (userStatistics) {
      setAllRatings(userStatistics.ratings ?? [])
      setFilteredRatings(userStatistics.ratings ?? [])
    }
  }, [userStatistics])

  useEffect(() => {
    if (search) {
      const ratings = allRatings.filter(
        (rating) =>
          rating?.book?.name.toLowerCase().includes(search.toLowerCase()) ||
          rating?.book?.author.toLowerCase().includes(search.toLowerCase()),
      )
      setFilteredRatings(ratings)
    } else {
      setFilteredRatings(allRatings)
    }
  }, [search, allRatings])

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
                    isValidating || (filteredRatings?.length ?? 0) > 1
                      ? 'smaller'
                      : ''
                  }
                >
                  {isValidating
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonRatingCard key={index} />
                      ))
                    : filteredRatings?.length > 0 &&
                      filteredRatings.map((rating: RatingProps) => {
                        if (rating?.book) {
                          return (
                            <ProfileCard
                              key={rating.id}
                              book={rating.book}
                              rating={rating}
                              onDeleteRating={async () => {
                                handleDeleteReview(rating.id)
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
