/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { User } from 'phosphor-react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { ProfileCard } from '@/pages/profile/partials/ProfileCard'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { UserDetails } from '@/pages/profile/partials/UserDetails'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { Pagination } from '@/components/shared/Pagination'
import { SearchBar } from '@/components/shared/SearchBar'
import { useProfileRatings } from '@/hooks/useProfileRatings'

import {
  UserRatings,
  UserRatingsContainer,
  ProfilePageContent,
  UserDetailsContainer,
  UserRatingsTitle,
} from './styles'

import { RatingProps } from '@/@types/rating'
import { BookProps } from '@/@types/book'
import { BookProvider } from '@/contexts/BookContext'
import { MainLayout } from '@/layouts/MainLayout'

import { useUserStatistics } from '@/hooks/useUserStatistics'

export default function Profile() {
  const router = useRouter()
  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const containerRef = useRef<HTMLDivElement>(null)
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const {
    ratings: userRatings,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    isValidatingRatings,
    mutateRatings,
  } = useProfileRatings(userId)

  const { userStatistics, isValidatingStatistics, mutateStatistics } =
    useUserStatistics(userId)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage])

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const ogImageUrl = `${baseUrl}/api/og/profile/${userId}`
  const profileUrl = `${baseUrl}/profile/${userId}`

  return (
    <>
      <Head>
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="Reading Profile · Book Nest" />
        <meta
          property="og:description"
          content="Check out this reader's stats on Book Nest."
        />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={profileUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Reading Profile · Book Nest" />
        <meta
          name="twitter:description"
          content="Check out this reader's stats on Book Nest."
        />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <MainLayout
        title="Profile | Book Nest"
        variant="tertiary"
        icon={<User />}
        pageTitle="Profile"
        isLateralMenuOpen={isLateralMenuOpen}
        setIsLateralMenuOpen={(value) => setIsLateralMenuOpen(value)}
        onUpdateBook={async () => {
          await mutateRatings()
          mutateStatistics()
        }}
        onUpdateRating={async () => {
          await mutateRatings()
          mutateStatistics()
        }}
        selectedBook={selectedBook}
      >
        <ProfilePageContent>
          <UserRatingsContainer>
            <UserRatingsTitle>User&apos;s Reviews</UserRatingsTitle>
            <SearchBar
              fullWidth
              placeholder="Search for Author or Title"
              search={search}
              onChange={(e) => {
                setCurrentPage(1)
                setSearch(e.target.value)
              }}
              onClick={() => {
                setCurrentPage(1)
                setSearch('')
              }}
            />
            <UserRatings
              ref={containerRef}
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
                <BookProvider
                  bookId={selectedBook?.id}
                  onUpdateBook={async () => {
                    await mutateRatings()
                    mutateStatistics()
                  }}
                  onUpdateRating={async () => {
                    await mutateRatings()
                    mutateStatistics()
                  }}
                >
                  {userRatings.map((rating: RatingProps) => {
                    if (rating?.book) {
                      return (
                        <ProfileCard
                          key={rating.id}
                          book={rating.book}
                          rating={rating}
                          userId={userId}
                          onSelect={() => {
                            setSelectedBook(rating.book as BookProps)
                            setIsLateralMenuOpen(true)
                          }}
                        />
                      )
                    }
                    return null
                  })}
                </BookProvider>
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
      </MainLayout>
    </>
  )
}
