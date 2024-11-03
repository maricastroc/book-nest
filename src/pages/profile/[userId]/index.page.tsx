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
  Divider,
  EmptyWrapper,
} from './styles'
import { MagnifyingGlass, User, X } from 'phosphor-react'
import { ProfileCard } from '@/components/ProfileCard'
import { EmptyContainer } from '@/components/EmptyContainer'
import { UserDetails } from '@/components/UserDetails'
import { RatingProps } from '@/@types/rating'
import { useScreenSize } from '@/utils/useScreenSize'
import { useAppContext, UserStatistics } from '@/contexts/AppContext'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()

  const { userId } = router.query

  const [search, setSearch] = useState('')

  const [userStatistics, setUserStatistics] = useState<
    UserStatistics | undefined
  >(undefined)

  const isMobile = useScreenSize(768)

  const { fetchUserStatistics } = useAppContext()

  useEffect(() => {
    const loadUserStatistics = async () => {
      const statistics = await fetchUserStatistics(userId as string, search)

      setUserStatistics(statistics)
    }

    if (userId !== undefined) {
      loadUserStatistics()
    }
  }, [userId, search])

  return (
    <>
      <NextSeo title="Profile | Book Wise" />
      <Container>
        {isMobile ? <MobileHeader /> : <Sidebar />}
        <ProfileWrapper>
          <ProfileContainer>
            <Heading>
              <HeadingTitle>
                <User />
                <h2>Profile</h2>
              </HeadingTitle>
            </Heading>
            <UserRatingsContainer>
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
              {!userStatistics?.ratings?.length && (
                <EmptyWrapper>
                  <EmptyContainer />
                </EmptyWrapper>
              )}
              <UserRatings>
                {userStatistics?.ratings?.length &&
                  userStatistics?.ratings?.length > 0 &&
                  userStatistics?.ratings.map((rating: RatingProps) => {
                    if (rating?.book) {
                      return (
                        <ProfileCard
                          key={rating.id}
                          book={rating.book}
                          rating={rating}
                        />
                      )
                    }

                    return null
                  })}
              </UserRatings>
            </UserRatingsContainer>
          </ProfileContainer>
          <Divider />
          <UserDetailsContainer>
            {userId && <UserDetails userId={userId as string} />}
          </UserDetailsContainer>
        </ProfileWrapper>
      </Container>
    </>
  )
}
