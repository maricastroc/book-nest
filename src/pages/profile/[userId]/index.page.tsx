/* eslint-disable react-hooks/exhaustive-deps */
import { MobileHeader } from '@/components/MobileHeader'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
  UserRatings,
  UserRatingsContainer,
  Container,
  Heading,
  HeadingTitle,
  ProfileContainer,
  SearchBar,
  UserDetailsContainer,
  ProfileWrapper,
  EmptyWrapper,
  UserRatingsTitle,
} from './styles'
import { MagnifyingGlass, User, X } from 'phosphor-react'
import { ProfileCard } from '@/components/ProfileCard'
import { EmptyContainer } from '@/components/EmptyContainer'
import { UserDetails } from '@/components/UserDetails'
import { RatingProps } from '@/@types/rating'
import { useScreenSize } from '@/utils/useScreenSize'
import { useAppContext, UserStatistics } from '@/contexts/AppContext'
import { useRouter } from 'next/router'
import { SkeletonRatingCard } from '@/components/SkeletonRatingCard'

export default function Profile() {
  const router = useRouter()

  const { userId } = router.query

  const [search, setSearch] = useState('')

  const [allRatings, setAllRatings] = useState<RatingProps[]>([])

  const [filteredRatings, setFilteredRatings] = useState<RatingProps[]>([])

  const [userStatistics, setUserStatistics] = useState<
    UserStatistics | undefined
  >(undefined)

  const isMobile = useScreenSize(768)

  const { fetchUserStatistics, isLoading } = useAppContext()

  const loadUserStatistics = async () => {
    const statistics = await fetchUserStatistics(userId as string, search)

    setUserStatistics(statistics)
    setAllRatings(statistics?.ratings ?? [])
    setFilteredRatings(statistics?.ratings ?? [])
  }

  useEffect(() => {
    if (userId !== undefined) {
      loadUserStatistics()
    }
  }, [userId])

  useEffect(() => {
    if (search) {
      const ratings = filteredRatings.filter(
        (rating) =>
          rating?.book?.name.toLowerCase().includes(search.toLowerCase()) ||
          rating?.book?.author.toLowerCase().includes(search.toLowerCase()),
      )

      setFilteredRatings(ratings)
    } else {
      setFilteredRatings(allRatings)
    }
  }, [userId, search])

  return (
    <>
      <NextSeo title="Profile | Book Wise" />
      <Container>
        {isMobile ? <MobileHeader /> : <Sidebar />}
        <ProfileWrapper>
          <Heading>
            <HeadingTitle>
              <User />
              <h2>Profile</h2>
            </HeadingTitle>
          </Heading>
          <ProfileContainer>
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
                  isLoading || (filteredRatings?.length ?? 0) > 1
                    ? 'smaller'
                    : ''
                }
              >
                {isLoading
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
                            onDeleteRating={() => loadUserStatistics()}
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
          </ProfileContainer>
        </ProfileWrapper>
      </Container>
    </>
  )
}
