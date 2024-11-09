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
import { BookCard } from '../../cards/BookCard'
import { UserRatingBox } from '../UserRatingBox'
import { RatingCardForm } from '../RatingCardForm'
import { CreateReviewData, EditReviewData } from '@/pages/home/index.page'
import { SignInModal } from '@/components/modals/SignInModal'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { ReviewWarningModal } from '@/components/modals/ReviewWarningModal'
import { EmptyContainer } from '../EmptyContainer'

export interface ReadingStatusProps {
  bookId: string
  userId: string
  status: string
}

interface BookReviewsSidebarProps {
  handleDeleteReview: (value: string) => Promise<void>
  handleEditReview: (data: EditReviewData) => Promise<void>
  handleCreateReview: (data: CreateReviewData) => Promise<void>
  handleSelectReadingStatus: (book: BookProps, status: string) => Promise<void>
  book: BookProps | null
  onClose: () => void
}

export function LateralMenu({
  book,
  handleDeleteReview,
  handleCreateReview,
  handleEditReview,
  handleSelectReadingStatus,
  onClose,
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

  const { isLoading, loggedUser } = useAppContext()

  useEffect(() => {
    if (book) {
      setBookRatings(book.ratings)
    }
  }, [book])

  useEffect(() => {
    if (book && book.ratings && loggedUser) {
      const foundUserRating = book.ratings.find(
        (rating) => rating.user.id === loggedUser.id,
      )
      setUserRating(foundUserRating)
    }
  }, [book, loggedUser])

  const handleOpenReviewForm = () => {
    userRating ? setIsReviewFormOpen(true) : setIsReviewWarningModalOpen(true)
  }

  const renderDialogTrigger = () => (
    <Dialog.Trigger asChild>
      <span onClick={() => setIsSignInModalOpen(true)}>Review</span>
    </Dialog.Trigger>
  )
  console.log(book)
  return (
    <LateralMenuWrapper>
      <OverlayBackground onClick={onClose} />
      <CloseButton onClick={onClose}>
        <X />
      </CloseButton>
      <MenuBody>
        {book && (
          <BookCard
            key={book.id}
            book={book}
            categories={book.categories as CategoryProps[]}
            handleCreateReview={handleCreateReview}
            handleSelectReadingStatus={async (status: string) => {
              await handleSelectReadingStatus(book, status)
            }}
            closeLateralMenu={() => onClose()}
          />
        )}
        <RatingsWrapper>
          <RatingsListHeader>
            <p>Ratings</p>
            {loggedUser && userRating?.description === '' ? (
              <Dialog.Root open={isReviewWarningModalOpen}>
                <Dialog.Trigger asChild>
                  <span onClick={handleOpenReviewForm}>Review</span>
                </Dialog.Trigger>
                <ReviewWarningModal
                  onClose={() => setIsReviewWarningModalOpen(false)}
                />
              </Dialog.Root>
            ) : (
              !userRating &&
              !loggedUser && (
                <Dialog.Root open={isSignInModalOpen}>
                  {renderDialogTrigger()}
                  <SignInModal onClose={() => setIsSignInModalOpen(false)} />
                </Dialog.Root>
              )
            )}
          </RatingsListHeader>
          {loggedUser && isReviewFormOpen && book && userRating && (
            <RatingCardForm
              isEdit
              rating={userRating}
              onClose={() => setIsReviewFormOpen(false)}
              bookId={book.id}
              handleEditReview={(data: EditReviewData) => {
                handleEditReview(data)
                onClose()
              }}
              handleCreateReview={(data: CreateReviewData) => {
                handleCreateReview(data)
                onClose()
              }}
            />
          )}
          <RatingsList>
            {!isLoading && !bookRatings?.length ? (
              <EmptyContainer content="reviews" />
            ) : isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonRatingCard key={index} />
              ))
            ) : (
              bookRatings
                ?.filter((rating) => rating.description?.trim() !== '')
                .map((rating) => (
                  <UserRatingBox
                    key={rating.id}
                    rating={rating}
                    onCloseUserRatingBox={onClose}
                    handleEditReview={handleEditReview}
                    handleDeleteReview={handleDeleteReview}
                    handleCreateReview={handleCreateReview}
                  />
                ))
            )}
          </RatingsList>
        </RatingsWrapper>
      </MenuBody>
    </LateralMenuWrapper>
  )
}
