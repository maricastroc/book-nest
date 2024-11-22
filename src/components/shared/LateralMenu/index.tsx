/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'

import { BookProps } from '@/@types/book'
import { CategoryProps } from '@/@types/category'
import { RatingProps } from '@/@types/rating'

import {
  CloseButton,
  LateralMenuWrapper,
  OverlayBackground,
  MenuBody,
  RatingsWrapper,
  RatingsList,
  RatingsListHeader,
} from './styles'
import { MenuBookCard } from './partials/MenuBookCard'
import { UserRatingBox } from './partials/UserRatingBox'
import { RatingCardForm } from '../RatingCardForm'
import { SignInModal } from '@/components/modals/SignInModal'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { ReviewWarningModal } from '@/components/shared/LateralMenu/partials/ReviewWarningModal'
import { EmptyContainer } from '../EmptyContainer'
import { READ_STATUS } from '@/utils/constants'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { SkeletonLateralMenu } from './partials/SkeletonLateralMenu'

export interface ReadingStatusProps {
  bookId: string
  userId: string
  status: string
}

interface LateralMenuProps {
  bookId: string
  onClose: () => void
  onCloseWithoutUpdate?: () => void
  onUpdateBook: (book: BookProps) => void
}

export function LateralMenu({
  bookId,
  onClose,
  onCloseWithoutUpdate,
  onUpdateBook,
}: LateralMenuProps) {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)

  const [book, setBook] = useState<BookProps | null>(null)

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const [isReviewWarningModalOpen, setIsReviewWarningModalOpen] =
    useState(false)

  const [userRating, setUserRating] = useState<RatingProps | undefined>(
    undefined,
  )

  const [isLoading, setIsLoading] = useState(false)

  const [bookRatings, setBookRatings] = useState<RatingProps[] | undefined>(
    undefined,
  )

  const { isValidating, loggedUser } = useAppContext()

  const shouldShowReviewOption = loggedUser && !userRating

  const shouldShowSignInOption = !loggedUser && !userRating

  const handleGetBookInfo = async (bookId: string) => {
    try {
      setIsLoading(true)

      const response = await api.get(`/books/${bookId}`)

      setBook(response.data.book)

      if (response.data.book) {
        const foundUserRating = response.data.book.ratings.find(
          (rating: RatingProps) => rating.user.id === loggedUser?.id,
        )

        setBookRatings(response.data.book.ratings)

        setUserRating(foundUserRating)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onUpdateReview = async (updatedReview: RatingProps) => {
    setBookRatings((prevRatings) => {
      const updatedRatings = prevRatings?.map((rating) =>
        rating.id === updatedReview.id ? updatedReview : rating,
      )
      return updatedRatings
    })

    setBook((prevBook) => {
      if (!prevBook) return prevBook

      const updatedRatings = bookRatings?.map((rating) =>
        rating.id === updatedReview.id ? updatedReview : rating,
      )

      const ratingCount = updatedRatings?.length ?? 0

      let averageRating

      if (updatedRatings) {
        averageRating =
          updatedRatings?.reduce((acc, rating) => acc + rating.rate, 0) /
          ratingCount
      }

      const updatedBook = {
        ...prevBook,
        rate: averageRating,
        userRating: updatedReview.rate,
        ratingCount: updatedRatings?.length,
        ratings: updatedRatings,
      }

      onUpdateBook(updatedBook)

      return updatedBook
    })
  }

  const onCreateReview = (newRating: RatingProps) => {
    const updatedRatings = setBookRatings((prevRatings) => [
      ...(prevRatings || []),
      newRating,
    ])

    setBook((prevBook) => {
      if (!prevBook) return prevBook

      const updatedRatings = [...(bookRatings || []), newRating]

      const ratingCount = updatedRatings.length

      const averageRating =
        updatedRatings.reduce((acc, rating) => acc + rating.rate, 0) /
        ratingCount

      const updatedBook = {
        ...prevBook,
        userRating: newRating.rate,
        ratings: updatedRatings,
        ratingCount,
        rate: averageRating,
      }

      onUpdateBook(updatedBook)

      return updatedBook
    })

    return updatedRatings
  }

  const onDeleteReview = (ratingId: string) => {
    const updatedRatings = setBookRatings((prevRatings) =>
      prevRatings?.filter((rating) => rating.id !== ratingId),
    )

    setBook((prevBook) => {
      if (!prevBook) return prevBook

      const updatedRatings = bookRatings?.filter(
        (rating) => rating.id !== ratingId,
      )

      const ratingCount = updatedRatings?.length ?? 0

      let averageRating

      if (updatedRatings) {
        averageRating =
          updatedRatings?.reduce((acc, rating) => acc + rating.rate, 0) /
          ratingCount
      }

      const updatedBook = {
        ...prevBook,
        userRating: undefined,
        ratings: updatedRatings,
        ratingCount,
        averageRating,
      }

      onUpdateBook(updatedBook)

      return updatedBook
    })

    return updatedRatings
  }

  const onUpdateStatus = (
    book: BookProps,
    newStatus: string,
    userRating: number,
  ) => {
    setBook((prevBook) => {
      if (!prevBook) return prevBook

      const updatedBook = {
        ...prevBook,
        userRating,
        ratingCount: book?.ratings?.length,
        readingStatus: newStatus,
      }

      onUpdateBook(updatedBook)

      return updatedBook
    })
  }

  useEffect(() => {
    if (bookId) {
      handleGetBookInfo(bookId)
    }
  }, [bookId])

  return (
    <LateralMenuWrapper>
      <OverlayBackground onClick={onCloseWithoutUpdate ?? onClose} />
      <CloseButton onClick={onCloseWithoutUpdate ?? onClose}>
        <X />
      </CloseButton>
      <MenuBody>
        {isLoading ? (
          <SkeletonLateralMenu />
        ) : (
          <>
            {book && (
              <MenuBookCard
                key={book.id}
                book={book}
                categories={book.categories as CategoryProps[]}
                onUpdateStatus={onUpdateStatus}
                onCreateReview={onCreateReview}
              />
            )}
            <RatingsWrapper>
              <RatingsListHeader>
                <p>Ratings</p>
                {shouldShowReviewOption &&
                  (book?.readingStatus === READ_STATUS ? (
                    <Dialog.Root open={isReviewFormOpen}>
                      <Dialog.Trigger asChild>
                        <span onClick={() => setIsReviewFormOpen(true)}>
                          Review
                        </span>
                      </Dialog.Trigger>
                    </Dialog.Root>
                  ) : (
                    <Dialog.Root open={isReviewWarningModalOpen}>
                      <Dialog.Trigger asChild>
                        <span onClick={() => setIsReviewWarningModalOpen(true)}>
                          Review
                        </span>
                      </Dialog.Trigger>
                      <ReviewWarningModal
                        onClose={() => setIsReviewWarningModalOpen(false)}
                      />
                    </Dialog.Root>
                  ))}
                {shouldShowSignInOption && (
                  <Dialog.Root open={isSignInModalOpen}>
                    <Dialog.Trigger asChild>
                      <span onClick={() => setIsSignInModalOpen(true)}>
                        Review
                      </span>
                    </Dialog.Trigger>
                    <SignInModal onClose={() => setIsSignInModalOpen(false)} />
                  </Dialog.Root>
                )}
              </RatingsListHeader>
              <RatingsList className={isReviewFormOpen ? 'reverse' : ''}>
                {book && isReviewFormOpen && (
                  <RatingCardForm
                    isEdit={!!userRating}
                    rating={userRating}
                    onClose={() => setIsReviewFormOpen(false)}
                    onUpdateReview={onUpdateReview}
                    onCreateReview={onCreateReview}
                    book={book}
                  />
                )}
                {!isValidating && !bookRatings?.length ? (
                  <EmptyContainer content="reviews" />
                ) : isValidating ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonRatingCard key={index} />
                  ))
                ) : (
                  book &&
                  bookRatings?.map((rating) => (
                    <UserRatingBox
                      key={rating.id}
                      book={book}
                      rating={rating}
                      onUpdateReview={onUpdateReview}
                      onCreateReview={onCreateReview}
                      onDeleteReview={onDeleteReview}
                    />
                  ))
                )}
              </RatingsList>
            </RatingsWrapper>
          </>
        )}
      </MenuBody>
    </LateralMenuWrapper>
  )
}
