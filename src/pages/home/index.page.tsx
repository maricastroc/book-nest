/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { CaretRight, ChartLineUp } from 'phosphor-react'

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
import { BookCard } from '@/components/cards/BookCard'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { Sidebar } from '@/components/shared/Sidebar'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { OutlineButton } from '@/components/core/OutlineButton'
import { MobileHeader } from '@/components/shared/MobileHeader'

import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { useScreenSize } from '@/hooks/useScreenSize'
import useRequest from '@/hooks/useRequest'
import { useAppContext } from '@/contexts/AppContext'
import { useSession } from 'next-auth/react'

export default function Home() {
  const router = useRouter()

  const isRouteLoading = useLoadingOnRouteChange()

  const session = useSession()

  const { isValidatingReview } = useAppContext()

  const [updatedPopularBooks, setUpdatedPopularBooks] = useState<
    BookProps[] | []
  >([])

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  const userLatestRatingRequest = session?.data?.user
    ? {
        url: `/ratings/user_latest`,
        method: 'GET',
        params: { userId: session?.data?.user?.id },
      }
    : null

  const { data: popularBooks } = useRequest<BookProps[]>({
    url: '/books/popular',
    method: 'GET',
  })

  const { data: latestRatings } = useRequest<RatingProps[]>({
    url: '/ratings/latest',
    method: 'GET',
  },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    })

  const {
    data: userLatestRatingData,
    mutate: mutateUserLatestRating,
    isValidating: isValidatingUserLatestReading,
  } = useRequest<RatingProps | null>(userLatestRatingRequest,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      revalidateOnMount: !session?.data?.user, 
    })

  const renderUserLatestRating = () => {
    if (isValidatingUserLatestReading || isValidatingReview) {
      return <SkeletonRatingCard withMarginBottom />
    }

    if (userLatestRatingData?.book) {
      return (
        <RatingCard
          key={userLatestRatingData.id}
          rating={userLatestRatingData}
          onOpenDetails={() => {
            setSelectedBook(userLatestRatingData.book as BookProps)
            setIsLateralMenuOpen(true)
          }}
        />
      )
    }

    return <EmptyContainer />
  }

  const renderLatestRatings = () => {
    if (!latestRatings?.length) {
      return Array.from({ length: 9 }).map((_, index) => (
        <SkeletonRatingCard key={index} />
      ))
    }

    return latestRatings.map((rating: RatingProps) => (
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
    ))
  }

  const renderPopularBooks = () => {
    if (!updatedPopularBooks?.length) {
      return Array.from({ length: 12 }).map((_, index) => (
        <SkeletonBookCard key={index} />
      ))
    }

    return updatedPopularBooks.map((book) => (
      <BookCard
        key={book.id}
        book={book}
        onOpenDetails={() => {
          setSelectedBook(book)
          setIsLateralMenuOpen(true)
        }}
      />
    ))
  }

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
                {session?.data?.user && (
                  <>
                    <UserLatestReadingTitle>
                      Your Last Review
                    </UserLatestReadingTitle>
                    <UserLatestReadingContainer>
                      {renderUserLatestRating()}
                    </UserLatestReadingContainer>
                  </>
                )}
                <LastRatingsContainer>
                  <LastRatingsTitle>Last Ratings</LastRatingsTitle>
                  <LastRatingsContent>
                    {renderLatestRatings()}
                  </LastRatingsContent>
                </LastRatingsContainer>
              </LastRatingsWrapper>

              <PopularBooksWrapper>
                <PopularBooksTitle>
                  <p>Popular Books</p>
                  <OutlineButton onClick={() => router.push('/explore')}>
                    View All
                    <CaretRight />
                  </OutlineButton>
                </PopularBooksTitle>
                <PopularBooksContent>
                  {renderPopularBooks()}
                </PopularBooksContent>
              </PopularBooksWrapper>
            </HomePageContent>
          </HomePageContainer>
        </HomePageWrapper>
      )}
    </>
  )
}
