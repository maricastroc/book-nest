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
import { X } from 'phosphor-react'
import { useState } from 'react'
import { UserRatingBox } from '../UserRatingBox'
import { useSession } from 'next-auth/react'
import { RatingCardForm } from '../RatingCardForm'
import * as Dialog from '@radix-ui/react-dialog'
import { SignInModal } from '@/components/modals/SignInModal'
import { BookProps } from '@/@types/book'
import { CategoryProps } from '@/@types/category'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { useAppContext } from '@/contexts/AppContext'
import { CreateReviewData, EditReviewData } from '@/pages/home/index.page'

interface BookReviewsSidebarProps {
  handleDeleteReview: (value: string) => void
  handleEditReview: (data: EditReviewData) => void
  handleCreateReview: (data: CreateReviewData) => void
  book: BookProps | null
  onClose: () => void
}

export function LateralMenu({
  book,
  handleDeleteReview,
  handleCreateReview,
  handleEditReview,
  onClose,
}: BookReviewsSidebarProps) {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const session = useSession()

  const { isLoading } = useAppContext()

  return (
    <LateralMenuWrapper>
      <OverlayBackground onClick={() => onClose()} />
      <CloseButton onClick={() => onClose()}>
        <X />
      </CloseButton>
      <MenuBody>
        {book && (
          <BookCard
            key={book.id}
            book={book}
            categories={book.categories as CategoryProps[]}
          />
        )}
        <RatingsWrapper>
          <RatingsListHeader>
            <p>Ratings</p>
            {session.data?.user ? (
              <span onClick={() => setIsReviewFormOpen(true)}>Review</span>
            ) : (
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <span onClick={() => setIsSignInModalOpen(true)}>Review</span>
                </Dialog.Trigger>
                {isSignInModalOpen && (
                  <SignInModal onClose={() => setIsSignInModalOpen(false)} />
                )}
              </Dialog.Root>
            )}
          </RatingsListHeader>
          {session.data?.user && isReviewFormOpen && book && (
            <RatingCardForm
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
            {isLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonRatingCard key={index} />
                ))}
              </>
            ) : (
              book?.ratings?.map((rating) => (
                <UserRatingBox
                  key={rating.id}
                  rating={rating}
                  onCloseUserRatingBox={() => onClose()}
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
