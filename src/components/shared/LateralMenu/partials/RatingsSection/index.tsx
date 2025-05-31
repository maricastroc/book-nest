import { useState } from 'react'
import { RatingsList, RatingsListHeader, RatingsWrapper } from './styles'
import { useBookDetails } from '@/hooks/useBookDetails'
import { DID_NOT_FINISH_STATUS, READ_STATUS } from '@/utils/constants'
import { RatingCardForm } from '@/components/shared/RatingCardForm'
import { AnimatePresence } from 'framer-motion'
import { FadeInUp } from '@/components/animations/FadeInUp'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { UserRatingBox } from '../UserRatingBox'
import { FadeInItem } from '@/components/animations/FadeInItem'
import { BookProps } from '@/@types/book'
import { useAppContext } from '@/contexts/AppContext'

interface Props {
  bookId: string
  isValidatingReview: boolean
  isValidatingStatus: boolean
  setIsSignInModalOpen: (value: boolean) => void
  setIsReviewWarningModalOpen: (value: boolean) => void
  onUpdateBook: (book: BookProps) => void
  mutateUserLatestRating?: () => Promise<void>
}

export const RatingsSection = ({
  bookId,
  isValidatingReview,
  isValidatingStatus,
  onUpdateBook,
  mutateUserLatestRating,
  setIsReviewWarningModalOpen,
  setIsSignInModalOpen,
}: Props) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)

  const { loggedUser } = useAppContext()

  const {
    updatedBook,
    bookRatings,
    userRating,
    isValidating,
    loadingState,
    onUpdateReview,
    onCreateReview,
    onDeleteReview,
  } = useBookDetails(bookId, onUpdateBook, mutateUserLatestRating)

  const shouldShowEmpty =
    !isValidating && !bookRatings?.length && !isReviewFormOpen

  const shouldShowSkeletons =
    loadingState?.reviews ||
    isValidatingReview ||
    isValidatingStatus ||
    isValidating

  const shouldShowRatings = updatedBook && bookRatings?.length

  const canUserReview =
    !userRating &&
    (updatedBook?.readingStatus === READ_STATUS ||
      updatedBook?.readingStatus === DID_NOT_FINISH_STATUS)

  return (
    <RatingsWrapper>
      <RatingsListHeader>
        <p>Ratings</p>
        {!userRating &&
          (canUserReview ? (
            <span onClick={() => setIsReviewFormOpen(true)}>Review</span>
          ) : (
            <span
              onClick={() => {
                if (loggedUser) {
                  setIsReviewWarningModalOpen(true)
                } else {
                  setIsSignInModalOpen(true)
                }
              }}
            >
              Review
            </span>
          ))}
      </RatingsListHeader>

      <RatingsList className={isReviewFormOpen ? 'reverse' : ''}>
        <AnimatePresence>
          {updatedBook && isReviewFormOpen && (
            <FadeInUp>
              <RatingCardForm
                isEdit={!!userRating}
                rating={userRating}
                onClose={() => setIsReviewFormOpen(false)}
                onUpdateReview={onUpdateReview}
                onCreateReview={onCreateReview}
                book={updatedBook}
              />
            </FadeInUp>
          )}
        </AnimatePresence>

        {shouldShowEmpty ? (
          <EmptyContainer content="reviews" />
        ) : shouldShowSkeletons ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonRatingCard key={index} />
          ))
        ) : shouldShowRatings ? (
          bookRatings.map((rating) => (
            <FadeInItem key={rating.id}>
              <UserRatingBox
                book={updatedBook}
                rating={rating}
                onUpdateReview={onUpdateReview}
                onCreateReview={onCreateReview}
                onDeleteReview={onDeleteReview}
              />
            </FadeInItem>
          ))
        ) : null}
      </RatingsList>
    </RatingsWrapper>
  )
}
