/* eslint-disable react-hooks/exhaustive-deps */
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
import { PopularBookCard } from '@/components/cards/PopularBookCard'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/shared/Sidebar'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/utils/useScreenSize'
import { UserLatestReadingCard } from '@/components/cards/UserLatestReadingCard'
import { SkeletonPopularBook } from '@/components/skeletons/SkeletonPopularBook'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { RatingProps } from '@/@types/rating'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import useRequest from '@/utils/useRequest'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { handleApiError } from '@/utils/handleApiError'
import { useAppContext } from '@/contexts/AppContext'

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
  const isRouteLoading = useLoadingOnRouteChange()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const { loggedUser } = useAppContext()

  const {
    data: popularBooks,
    isValidating: isValidatingPopularBooks,
    mutate: mutatePopularBooks,
  } = useRequest<BookProps[]>({
    url: '/books/popular',
    method: 'GET',
  })

  const {
    data: latestRatings,
    isValidating: isValidatingLatestRatings,
    mutate: mutateLatestRatings,
  } = useRequest<RatingProps[]>({
    url: '/ratings/latest',
    method: 'GET',
  })

  const { data: userLatestRatingData, mutate: mutateUserLatestRating } =
    useRequest<RatingProps | null>({
      url: '/ratings/user_latest',
      method: 'GET',
      params: { userId: loggedUser?.id },
    })

  const isMobile = useScreenSize(768)

  function handleCloseLateralMenu() {
    setOpenLateralMenu(false)
  }

  const handleDeleteReview = async (id: string) => {
    try {
      const payload = { id }

      await api.delete('/ratings', { data: payload })

      toast.success('Rating successfully deleted!')

      await mutateUserLatestRating()
      await mutateLatestRatings()
      await mutatePopularBooks()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleEditReview = async (data: EditReviewData) => {
    try {
      const payload = {
        id: data.ratingId,
        description: data.description,
        rate: data.rate,
      }

      await api.put('/ratings', payload)

      toast.success('Rating successfully edited!')

      await mutateUserLatestRating()
      await mutateLatestRatings()
      await mutatePopularBooks()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreateReview = async (data: CreateReviewData) => {
    try {
      const payload = {
        bookId: data.bookId,
        userId: data.userId,
        description: data.description,
        rate: data.rate,
      }

      await api.post(`/ratings`, { data: payload })

      toast.success('Rating successfully submitted!')

      await mutateUserLatestRating()
      await mutateLatestRatings()
      await mutatePopularBooks()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleSelectReadingStatus = async (book: BookProps, status: string) => {
    if (loggedUser && book) {
      try {
        const payload = {
          userId: loggedUser?.id,
          bookId: book.id,
          status,
        }

        await api.post('/reading_status', payload)

        await mutateUserLatestRating()
        await mutateLatestRatings()
        await mutatePopularBooks()
      } catch (error) {
        handleApiError(error)
      }
    }
  }

  useEffect(() => {
    const loadUserLatestRating = async () => {
      if (!loggedUser) return

      mutateUserLatestRating()
    }

    loadUserLatestRating()
  }, [loggedUser])

  const isLoading = isValidatingPopularBooks || isValidatingLatestRatings

  return (
    <>
      <NextSeo title="Home | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <HomePageWrapper>
          {openLateralMenu && (
            <LateralMenu
              handleDeleteReview={handleDeleteReview}
              handleCreateReview={handleCreateReview}
              handleEditReview={handleEditReview}
              handleSelectReadingStatus={handleSelectReadingStatus}
              book={selectedBook}
              onClose={handleCloseLateralMenu}
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
                      Your last reading
                    </UserLatestReadingTitle>
                    <UserLatestReadingContainer>
                      {isLoading ? (
                        <SkeletonRatingCard withMarginBottom />
                      ) : userLatestRatingData && userLatestRatingData?.book ? (
                        <UserLatestReadingCard
                          key={userLatestRatingData.id}
                          rating={userLatestRatingData}
                          book={userLatestRatingData.book}
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
                    {isLoading || !latestRatings?.length
                      ? Array.from({ length: 9 }).map((_, index) => (
                          <SkeletonRatingCard key={index} />
                        ))
                      : latestRatings?.map((rating: RatingProps) => (
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
                  {isLoading || !popularBooks?.length
                    ? Array.from({ length: 12 }).map((_, index) => (
                        <SkeletonPopularBook key={index} />
                      ))
                    : popularBooks?.length > 0 &&
                      popularBooks?.map((book) => (
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
      )}
    </>
  )
}
