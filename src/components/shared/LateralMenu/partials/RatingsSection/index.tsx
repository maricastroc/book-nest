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
import { BookProps } from '@/@types/book'

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

  const { userRating, bookData } = useBookContext()

  const shouldShowEmpty =
    !isValidatingReview &&
    !bookData.ratings?.length &&
    !isReviewFormOpen &&
    !userRating.rating

  const shouldShowSkeletons = isValidatingReview || isValidatingStatus

  const shouldShowRatings =
    bookData.book && (bookData.ratings?.length || !!userRating.rating)

  const canUserReview = !!loggedUser && !userRating.rating

  return (
    <RatingsWrapper>
      <RatingsListHeader>
        <p>Ratings</p>
        {canUserReview ? (
          <span
            onClick={() => {
              if (
                bookData.book?.readingStatus === READ_STATUS ||
                bookData.book?.readingStatus === DID_NOT_FINISH_STATUS
              ) {
                setIsReviewFormOpen(true)
                return
              }

              setIsReviewWarningModalOpen(true)
            }}
          >
            Review
          </span>
        ) : (
          !loggedUser && (
            <span onClick={() => setIsSignInModalOpen(true)}>Review</span>
          )
        )}
      </RatingsListHeader>

      <RatingsList className={isReviewFormOpen ? 'reverse' : ''}>
        <AnimatePresence>
          {bookData.book && isReviewFormOpen && (
            <FadeInUp>
              <RatingCardForm
                isEdit={!!userRating.rating}
                rating={userRating.rating}
                onClose={() => setIsReviewFormOpen(false)}
                book={bookData.book}
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
            {userRating.rating && (
              <UserRatingBox
                book={bookData.book as BookProps}
                rating={userRating.rating}
              />
            )}
            {bookData.ratings.map((rating) => (
              <FadeInItem key={rating.id}>
                <UserRatingBox
                  book={bookData.book as BookProps}
                  rating={rating}
                />
              </FadeInItem>
            ))}
          </>
        ) : null}
      </RatingsList>
    </RatingsWrapper>
  )
}
