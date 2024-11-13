import { MobileHeader } from '@/components/shared/MobileHeader'
import {
  HomePageWrapper,
  HomePageHeading,
  HomePageContainer,
  HomePageContent,
  LastRatingsContainer,
  LastRatingsContent,
  LastRatingsTitle,
  LastRatingsWrapper,
  UserLatestReadingContainer,
  UserLatestReadingTitle,
  PopularBooksWrapper,
  PopularBooksContent,
  PopularBooksTitle,
} from './styles'
import { RatingCard } from '@/components/cards/RatingCard'
import { CaretRight, ChartLineUp } from 'phosphor-react'
import { BookCard } from '@/components/cards/BookCard'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { Sidebar } from '@/components/shared/Sidebar'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/utils/useScreenSize'
import { UserLatestReadingCard } from '@/pages/home/partials/UserLatestReadingCard'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { RatingProps } from '@/@types/rating'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { useAppContext } from '@/contexts/AppContext'
import { useRouter } from 'next/router'

export interface EditReviewData {
  ratingId: string
  description: string
  rate: number
}

export interface CreateReviewData {
  userId: string
  bookId: string
  description?: string
  rate: number
}

export default function Home() {
  const router = useRouter()

  const isRouteLoading = useLoadingOnRouteChange()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  const isMobile = useScreenSize(768)

  const {
    loggedUser,
    userLatestRatingData,
    isValidatingHomePage,
    popularBooks,
    latestRatings,
  } = useAppContext()

  return (
    <>
      <NextSeo title="Home | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <HomePageWrapper>
          {isLateralMenuOpen && (
            <LateralMenu
              book={selectedBook}
              onClose={() => setIsLateralMenuOpen(false)}
            />
          )}
          {isMobile ? <MobileHeader /> : <Sidebar />}
          <HomePageContainer>
            <HomePageHeading>
              <ChartLineUp />
              <h2>Home</h2>
            </HomePageHeading>
            <HomePageContent>
              <LastRatingsWrapper>
                {loggedUser && (
                  <>
                    <UserLatestReadingTitle>
                      Your Last Review
                    </UserLatestReadingTitle>
                    <UserLatestReadingContainer>
                      {isValidatingHomePage ? (
                        <SkeletonRatingCard withMarginBottom />
                      ) : userLatestRatingData && userLatestRatingData?.book ? (
                        <UserLatestReadingCard
                          key={userLatestRatingData.id}
                          rating={userLatestRatingData}
                          book={userLatestRatingData.book}
                          onOpenDetails={() => {
                            setSelectedBook(
                              userLatestRatingData.book as BookProps,
                            )
                            setIsLateralMenuOpen(true)
                          }}
                        />
                      ) : (
                        <EmptyContainer />
                      )}
                    </UserLatestReadingContainer>
                  </>
                )}
                <LastRatingsContainer>
                  <LastRatingsTitle>Last Ratings</LastRatingsTitle>
                  <LastRatingsContent>
                    {!latestRatings?.length || isValidatingHomePage
                      ? Array.from({ length: 9 }).map((_, index) => (
                          <SkeletonRatingCard key={index} />
                        ))
                      : latestRatings?.map((rating: RatingProps) => (
                          <RatingCard
                            key={rating.id}
                            rating={rating}
                            onOpenDetails={() => {
                              if (rating?.book) {
                                setSelectedBook(rating.book as BookProps)
                                setIsLateralMenuOpen(true)
                              }
                            }}
                          />
                        ))}
                  </LastRatingsContent>
                </LastRatingsContainer>
              </LastRatingsWrapper>

              <PopularBooksWrapper>
                <PopularBooksTitle>
                  <p>Popular Books</p>
                  <span onClick={() => router.push('/explore')}>
                    View All
                    <CaretRight />
                  </span>
                </PopularBooksTitle>
                <PopularBooksContent>
                  {!popularBooks?.length || isValidatingHomePage
                    ? Array.from({ length: 12 }).map((_, index) => (
                        <SkeletonBookCard key={index} />
                      ))
                    : popularBooks?.length > 0 &&
                      popularBooks?.map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          onOpenDetails={() => {
                            setSelectedBook(book)
                            setIsLateralMenuOpen(true)
                          }}
                        />
                      ))}
                </PopularBooksContent>
              </PopularBooksWrapper>
            </HomePageContent>
          </HomePageContainer>
        </HomePageWrapper>
      )}
    </>
  )
}
