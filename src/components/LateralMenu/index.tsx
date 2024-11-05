import {
  CloseButton,
  LateralMenuWrapper,
  OverlayBackground,
  MenuBody,
  RatingsWrapper,
  RatingsList,
  RatingsListHeader,
} from './styles'
import { BookCard } from './components/BookCard'
import { X } from 'phosphor-react'
import { useState } from 'react'
import { UserRatingBox } from './components/UserRatingBox'
import { useSession } from 'next-auth/react'
import { RatingCardForm } from './components/RatingCardForm'
import * as Dialog from '@radix-ui/react-dialog'
import { SignInModal } from '../SignInModal'
import { BookProps } from '@/@types/book'
import { CategoryProps } from '@/@types/category'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { SkeletonRatingCard } from '../SkeletonRatingCard'
import { useAppContext } from '@/contexts/AppContext'

interface BookReviewsSidebarProps {
  book: BookProps | null
  onClose: () => void
}

export function LateralMenu({ book, onClose }: BookReviewsSidebarProps) {
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
              avatarUrl={session.data?.user?.avatarUrl ?? AVATAR_URL_DEFAULT}
              name={session.data?.user.name}
              onClose={() => setIsReviewFormOpen(false)}
              onCloseLateralMenu={() => onClose()}
              bookId={book.id}
              userId={session.data?.user.id}
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
                />
              ))
            )}
          </RatingsList>
        </RatingsWrapper>
      </MenuBody>
    </LateralMenuWrapper>
  )
}
