/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BookWithRatingAndCategories } from '@/pages/home/index.page'
import {
  CloseButton,
  Container,
  ContainerOverlay,
  LateralMenuContainer,
} from './styles'
import { BookCard } from './components/BookCard'
import { X } from 'phosphor-react'

interface BookReviewsSidebarProps {
  book: BookWithRatingAndCategories | null
  onClose: () => void
}

export function LateralMenu({ book, onClose }: BookReviewsSidebarProps) {
  return (
    <Container>
      <CloseButton onClick={() => onClose()}>
        <X />
      </CloseButton>
      <ContainerOverlay />
      <LateralMenuContainer>
        <BookCard
          name={book?.name!}
          author={book?.author!}
          cover_url={book?.cover_url!}
          rating={book?.rating!}
          total_pages={book?.total_pages!}
          categories={book?.categories!}
        />
      </LateralMenuContainer>
    </Container>
  )
}
