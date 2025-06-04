import { useState } from 'react'
import { RatingsList, RatingsListHeader, RatingsWrapper } from './styles'
import { DID_NOT_FINISH_STATUS, READ_STATUS } from '@/utils/constants'
import { RatingCardForm } from '@/components/shared/RatingCardForm'
import { AnimatePresence } from 'framer-motion'
import { FadeInUp } from '@/components/animations/FadeInUp'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { UserRatingBox } from '../UserRatingBox'
import { FadeInItem } from '@/components/animations/FadeInItem'
import { useAppContext } from '@/contexts/AppContext'
import { useBookContext } from '@/contexts/BookContext'

interface Props {
  isValidatingStatus: boolean
  setIsSignInModalOpen: (value: boolean) => void
  setIsReviewWarningModalOpen: (value: boolean) => void
}

export const RatingsSection = ({
  isValidatingStatus,
  setIsReviewWarningModalOpen,
  setIsSignInModalOpen,
}: Props) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)

  const { loggedUser, isValidatingReview } = useAppContext()

  const { userRating, updatedBook, bookRatings } = useBookContext()

  const shouldShowEmpty =
    !isValidatingReview &&
    !bookRatings?.length &&
    !isReviewFormOpen &&
    !userRating

  const shouldShowSkeletons = isValidatingReview || isValidatingStatus

  const shouldShowRatings = updatedBook && (bookRatings?.length || !!userRating)

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
          <>
            {userRating && (
              <UserRatingBox book={updatedBook} rating={userRating} />
            )}
            {bookRatings.map((rating) => (
              <FadeInItem key={rating.id}>
                <UserRatingBox book={updatedBook} rating={rating} />
              </FadeInItem>
            ))}
          </>
        ) : null}
      </RatingsList>
    </RatingsWrapper>
  )
}
