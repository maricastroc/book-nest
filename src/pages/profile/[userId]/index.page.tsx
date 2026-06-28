/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { ProfileCard } from '@/pages/profile/partials/ProfileCard'
import { EmptyContainer } from '@/components/ui/EmptyContainer'
import { UserDetails } from '@/pages/profile/partials/UserDetails'
import { SkeletonRatingCard } from '@/components/features/books/SkeletonRatingCard'
import { Pagination } from '@/components/ui/Pagination'
import { SearchBar } from '@/components/ui/SearchBar'
import { useProfileRatings } from '@/hooks/useProfileRatings'

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
        icon={<FontAwesomeIcon icon={faUser} />}
        pageTitle=""
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
        <div className="bn-scope flex h-full flex-col overflow-hidden">
          <header className="shrink-0 border-line px-6 pb-6 pt-8 md:px-10 md:pt-10">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg3">
              <FontAwesomeIcon icon={faUser} style={{ fontSize: 12 }} />
              <span>The Reader</span>
            </div>
            <h1 className="font-serif text-[2rem] font-semibold leading-tight tracking-tight text-fg">
              {userStatistics?.user?.name ?? 'Profile'}
            </h1>
          </header>

          <div className="flex min-h-0 flex-1 flex-col-reverse items-start justify-start lg:grid lg:h-full lg:grid-cols-[2fr_1fr] lg:pr-5">
            <div className="lg:pl-12 flex w-full flex-col mx-auto pt-8 lg:pt-0 lg:overflow-y-scroll lg:min-w-104">
              <p className="text-sm text-fg2 mb-2">User&apos;s Reviews</p>
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
              <div
                ref={containerRef}
                className={`mt-8 flex flex-col items-start w-full gap-4 lg:overflow-y-scroll lg:max-h-[64vh] lg:min-w-108 ${
                  isValidatingRatings || userRatings?.length > 0
                    ? 'md:pr-4'
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
              </div>
            </div>

            <div className="flex w-full flex-col items-start overflow-scroll lg:items-center lg:max-h-[80vh] lg:p-4 xl:h-screen">
              <UserDetails
                userStatistics={userStatistics}
                userId={userId}
                isLoading={isValidatingStatistics}
              />
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}
