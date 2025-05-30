import { BookProps } from '@/@types/book'
import {
  BookCover,
  BookTitleAndAuthor,
  BookContentWrapper,
  BookCardBox,
} from './styles'
import { ReadingStatusTag } from '@/components/shared/ReadingStatusTag'

interface BookCardProps {
  book: BookProps
  onOpenDetails: () => void
  size?: string
  onClose?: () => void
  onUpdateBook?: (book: BookProps) => void
}

export function ExploreCard({ book, onOpenDetails, size = '' }: BookCardProps) {
  return (
    <BookCardBox
      onClick={() => {
        onOpenDetails()
      }}
    >
      <BookCover src={book.coverUrl} onClick={() => onOpenDetails()} />
      <BookContentWrapper>
        <ReadingStatusTag readingStatus={book.readingStatus as string} />
        <BookTitleAndAuthor className={size}>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
        </BookTitleAndAuthor>
      </BookContentWrapper>
    </BookCardBox>
  )
}
