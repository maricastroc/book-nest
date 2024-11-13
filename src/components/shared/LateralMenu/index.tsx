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

export interface ReadingStatusProps {
  bookId: string
  userId: string
  status: string
}

interface BookReviewsSidebarProps {
  isOpen?: boolean
  book: BookProps | null
  onClose: () => void
  onCloseWithoutUpdate?: () => void
}

export function LateralMenu({
  isOpen,
  book,
  onClose,
  onCloseWithoutUpdate,
}: BookReviewsSidebarProps) {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const [isReviewWarningModalOpen, setIsReviewWarningModalOpen] =
    useState(false)

  const [userRating, setUserRating] = useState<RatingProps | undefined>(
    undefined,
  )

  const [bookRatings, setBookRatings] = useState<RatingProps[] | undefined>(
    undefined,
  )

  const { isValidating, loggedUser } = useAppContext()

  const shouldShowReviewOption = loggedUser && !userRating

  const shouldShowSignInOption = !loggedUser && !userRating

  useEffect(() => {
    if (book) {
      setBookRatings(book.ratings)
    }
  }, [book])

  const loadRatings = () => {
    if (book && book.ratings && loggedUser) {
      const foundUserRating = book.ratings.find(
        (rating) => rating.user.id === loggedUser.id,
      )
      setUserRating(foundUserRating)
    }
  }

  useEffect(() => {
    loadRatings()
  }, [book, loggedUser, isOpen])

  return (
    <LateralMenuWrapper>
      <OverlayBackground onClick={onCloseWithoutUpdate ?? onClose} />
      <CloseButton onClick={onCloseWithoutUpdate ?? onClose}>
        <X />
      </CloseButton>
      <MenuBody>
        {book && (
          <MenuBookCard
            key={book.id}
            book={book}
            categories={book.categories as CategoryProps[]}
            loadRatings={() => loadRatings()}
            closeLateralMenu={onClose}
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
                  <span onClick={() => setIsSignInModalOpen(true)}>Review</span>
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
                closeLateralMenu={onClose}
                bookId={book?.id}
              />
            )}
            {!isValidating && !bookRatings?.length ? (
              <EmptyContainer content="reviews" />
            ) : isValidating ? (
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonRatingCard key={index} />
              ))
            ) : (
              bookRatings?.map((rating) => (
                <UserRatingBox
                  key={rating.id}
                  rating={rating}
                  onCloseUserRatingBox={onClose}
                  closeLateralMenu={onClose}
                />
              ))
            )}
          </RatingsList>
        </RatingsWrapper>
      </MenuBody>
    </LateralMenuWrapper>
  )
}
