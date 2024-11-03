import {
  CloseButton,
  Container,
  ContainerOverlay,
  LateralMenuContainer,
  RatingsContainer,
  RatingsContent,
  RatingsContentTitle,
} from './styles'
import { BookCard } from './components/BookCard'
import { X } from 'phosphor-react'
import { useState } from 'react'
import { LateralRatingCard } from './components/LateralRatingCard'
import { useSession } from 'next-auth/react'
import { RatingCardForm } from './components/RatingCardForm'
import * as Dialog from '@radix-ui/react-dialog'
import { LoginModal } from '../LoginModal'
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

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const session = useSession()

  const { isLoading } = useAppContext()

  return (
    <Container>
      <ContainerOverlay onClick={() => onClose()} />
      <CloseButton onClick={() => onClose()}>
        <X />
      </CloseButton>
      <LateralMenuContainer>
        {book && (
          <BookCard
            key={book.id}
            book={book}
            categories={book.categories as CategoryProps[]}
          />
        )}
        <RatingsContainer>
          <RatingsContentTitle>
            <p>Ratings</p>
            {session.data?.user ? (
              <span onClick={() => setIsReviewFormOpen(true)}>Review</span>
            ) : (
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <span onClick={() => setIsLoginModalOpen(true)}>Review</span>
                </Dialog.Trigger>
                {isLoginModalOpen && (
                  <LoginModal onClose={() => setIsLoginModalOpen(false)}/>
                )}
              </Dialog.Root>
            )}
          </RatingsContentTitle>
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
          <RatingsContent>
            {isLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonRatingCard key={index} />
                ))}
              </>
            ) : (
              book?.ratings?.map((rating) => (
                <LateralRatingCard
                  key={rating.id}
                  rating={rating}
                  onCloseLateralMenu={() => onClose()}
                />
              ))
            )}
          </RatingsContent>
        </RatingsContainer>
      </LateralMenuContainer>
    </Container>
  )
}
