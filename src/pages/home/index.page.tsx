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
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/shared/Sidebar'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/hooks/useScreenSize'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { RatingProps } from '@/@types/rating'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { useAppContext } from '@/contexts/AppContext'
import { useRouter } from 'next/router'
import { MobileHeader } from '@/components/shared/MobileHeader'
import useRequest from '@/hooks/useRequest'

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

  const [updatedPopularBooks, setUpdatedPopularBooks] = useState<
    BookProps[] | []
  >([])

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  const { loggedUser } = useAppContext()

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  const { data: popularBooks } = useRequest<BookProps[]>({
    url: '/books/popular',
    method: 'GET',
  })

  const { data: latestRatings } = useRequest<RatingProps[]>({
    url: '/ratings/latest',
    method: 'GET',
  })

  const {
    data: userLatestRatingData,
    mutate: mutateUserLatestRating,
    isValidating: isValidatingUserLatestReading,
  } = useRequest<RatingProps | null>({
    url: '/ratings/user_latest',
    method: 'GET',
    params: { userId: loggedUser?.id },
  })

  const onUpdateBook = async (updatedBook: BookProps) => {
    setUpdatedPopularBooks((prevBooks) => {
      if (!prevBooks) return prevBooks

      const updatedBooks = prevBooks.map((book) =>
        book.id === updatedBook.id ? updatedBook : book,
      )

      return updatedBooks
    })
  }

  useEffect(() => {
    if (popularBooks) {
      setUpdatedPopularBooks(popularBooks)
    }
  }, [popularBooks])

  return (
    <>
      <NextSeo title="Home | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <HomePageWrapper>
          {isLateralMenuOpen && selectedBook && (
            <LateralMenu
              bookId={selectedBook.id}
              onClose={() => setIsLateralMenuOpen(false)}
              onUpdateBook={onUpdateBook}
              mutateUserLatestRating={mutateUserLatestRating}
            />
          )}
          {isSmallSize || isMediumSize ? <MobileHeader /> : <Sidebar />}
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
                      {isValidatingUserLatestReading ? (
                        <SkeletonRatingCard withMarginBottom />
                      ) : userLatestRatingData && userLatestRatingData?.book ? (
                        <RatingCard
                          key={userLatestRatingData.id}
                          rating={userLatestRatingData}
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
                    {!latestRatings?.length
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
                  {!updatedPopularBooks?.length
                    ? Array.from({ length: 12 }).map((_, index) => (
                        <SkeletonBookCard key={index} />
                      ))
                    : updatedPopularBooks?.length > 0 &&
                      updatedPopularBooks?.map((book) => (
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
