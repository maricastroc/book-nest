import { MobileHeader } from '@/components/MobileHeader'
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
import { RatingCard } from '@/components/RatingCard'
import { useSession } from 'next-auth/react'
import { CaretRight, ChartLineUp } from 'phosphor-react'
import { PopularBookCard } from '@/components/PopularBookCard'
import { EmptyContainer } from '@/components/EmptyContainer'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { LateralMenu } from '@/components/LateralMenu'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/utils/useScreenSize'
import { UserLatestReadingCard } from '@/components/UserLatestReadingCard'
import { useAppContext } from '@/contexts/AppContext'
import { SkeletonPopularBook } from '@/components/SkeletonPopularBook'
import { SkeletonRatingCard } from '@/components/SkeletonRatingCard'
import { RatingProps } from '@/@types/rating'

export default function Home() {
  const session = useSession()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const {
    isLoading,
    popularBooks,
    userLatestRating,
    latestRatings,
    refreshUserLatestRatings,
  } = useAppContext()

  const isMobile = useScreenSize(768)

  function handleCloseLateralMenu() {
    setOpenLateralMenu(false)
  }

  useEffect(() => {
    refreshUserLatestRatings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.data?.user])

  return (
    <>
      <NextSeo title="Home | Book Wise" />
      <HomePageWrapper>
        {openLateralMenu && (
          <LateralMenu book={selectedBook} onClose={handleCloseLateralMenu} />
        )}
        {isMobile ? <MobileHeader /> : <Sidebar />}
        <HomePageContainer>
          <HomePageHeading>
            <ChartLineUp />
            <h2>Home</h2>
          </HomePageHeading>
          <HomePageContent>
            <LastRatingsWrapper>
              {session.data?.user && (
                <>
                  <UserLatestReadingTitle>
                    Your last reading
                  </UserLatestReadingTitle>
                  <UserLatestReadingContainer>
                    {isLoading ? (
                      <SkeletonRatingCard withMarginBottom />
                    ) : userLatestRating && userLatestRating?.book ? (
                      <>
                        <UserLatestReadingCard
                          key={userLatestRating.id}
                          rating={userLatestRating}
                          book={userLatestRating.book}
                        />
                      </>
                    ) : (
                      <>
                        <EmptyContainer />
                      </>
                    )}
                  </UserLatestReadingContainer>
                </>
              )}
              <LastRatingsContainer>
                <LastRatingsTitle>Last Ratings</LastRatingsTitle>
                <LastRatingsContent>
                  {isLoading || !latestRatings.length
                    ? Array.from({ length: 9 }).map((_, index) => (
                        <SkeletonRatingCard key={index} />
                      ))
                    : latestRatings.map((rating: RatingProps) => (
                        <RatingCard key={rating.id} rating={rating} />
                      ))}
                </LastRatingsContent>
              </LastRatingsContainer>
            </LastRatingsWrapper>

            <PopularBooksWrapper>
              <PopularBooksTitle>
                <p>Popular Books</p>
                <span>
                  View All
                  <CaretRight />
                </span>
              </PopularBooksTitle>
              <PopularBooksContent>
                {isLoading || !popularBooks.length
                  ? Array.from({ length: 12 }).map((_, index) => (
                      <SkeletonPopularBook key={index} />
                    ))
                  : popularBooks.length > 0 &&
                    popularBooks.map((book) => (
                      <PopularBookCard
                        key={book.id}
                        book={book}
                        onOpenDetails={() => {
                          setSelectedBook(book)
                          setOpenLateralMenu(true)
                        }}
                      />
                    ))}
              </PopularBooksContent>
            </PopularBooksWrapper>
          </HomePageContent>
        </HomePageContainer>
      </HomePageWrapper>
    </>
  )
}
