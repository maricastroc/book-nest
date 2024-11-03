import { MobileHeader } from '@/components/MobileHeader'
import {
  Container,
  Heading,
  HomeContainer,
  HomeContent,
  LastRatingsContainer,
  LastRatingsContent,
  LastRatingsTitle,
  LastRatingsWrapper,
  LastReadContainer,
  LastReadTitle,
  PopularBooksCardsContainer,
  PopularBooksCardsContent,
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
import { LastReadCard } from '@/components/LastReadCard'
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

  function handleSetSelectedBook(ratingBookId: string | undefined) {
    if (!ratingBookId) {
      return
    }

    const foundBook = popularBooks.find((book) => book.id === ratingBookId)
    if (!foundBook) {
      return
    }

    setSelectedBook(foundBook)
    setOpenLateralMenu(true)
  }

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
      <Container>
        {openLateralMenu && (
          <LateralMenu book={selectedBook} onClose={handleCloseLateralMenu} />
        )}
        {isMobile ? <MobileHeader /> : <Sidebar />}
        <HomeContainer>
          <Heading>
            <ChartLineUp />
            <h2>Home</h2>
          </Heading>
          <HomeContent>
            <LastRatingsWrapper>
              {session.data?.user && (
                <>
                  <LastReadTitle>Your last reading</LastReadTitle>
                  <LastReadContainer>
                    {isLoading ? (
                      <SkeletonRatingCard withMarginBottom />
                    ) : userLatestRating && userLatestRating?.book ? (
                      <>
                        <LastReadCard
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
                  </LastReadContainer>
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
                        <RatingCard
                          key={rating.id}
                          rating={rating}
                          onClick={() => {
                            handleSetSelectedBook(rating?.book?.id)
                          }}
                        />
                      ))}
                </LastRatingsContent>
              </LastRatingsContainer>
            </LastRatingsWrapper>

            <PopularBooksCardsContainer>
              <PopularBooksTitle>
                <p>Popular Books</p>
                <span>
                  View All
                  <CaretRight />
                </span>
              </PopularBooksTitle>
              <PopularBooksCardsContent>
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
              </PopularBooksCardsContent>
            </PopularBooksCardsContainer>
          </HomeContent>
        </HomeContainer>
      </Container>
    </>
  )
}
