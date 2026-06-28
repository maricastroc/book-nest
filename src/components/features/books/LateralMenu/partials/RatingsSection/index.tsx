import { useEffect, useState } from 'react'
import { DID_NOT_FINISH_STATUS, READ_STATUS } from '@/utils/constants'
import { RatingCardForm } from '@/components/features/books/RatingCardForm'
import { AnimatePresence } from 'framer-motion'
import { FadeInUp } from '@/components/ui/animations/FadeInUp'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { UserRatingBox } from '../UserRatingBox'
import { FadeInItem } from '@/components/ui/animations/FadeInItem'
import { useAppContext } from '@/contexts/AppContext'
import { useBookContext } from '@/contexts/BookContext'
import { BookProps } from '@/@types/book'
import { useRatings } from '@/contexts/RatingsContext'

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
  const { registerRatingGroup } = useRatings()
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

  useEffect(() => {
    if (bookData.ratings?.length) {
      registerRatingGroup('book', bookData.ratings)
    }
  }, [bookData.ratings, registerRatingGroup])

  return (
    <div className="mt-10 flex w-full flex-col gap-3 pb-8">
      {/* Header */}
      <div className="mb-1 flex w-full items-center justify-between">
        <p className="text-[0.875rem] font-semibold text-fg">Ratings</p>
        {canUserReview ? (
          <button
            type="button"
            className="text-[0.82rem] font-medium text-ac transition-opacity hover:opacity-70"
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
          </button>
        ) : (
          !loggedUser && (
            <button
              type="button"
              className="text-[0.82rem] font-medium text-ac transition-opacity hover:opacity-70"
              onClick={() => setIsSignInModalOpen(true)}
            >
              Review
            </button>
          )
        )}
      </div>

      {/* List */}
      <div className="flex w-full flex-col gap-3">
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
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRatingCard key={i} />
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
      </div>
    </div>
  )
}
