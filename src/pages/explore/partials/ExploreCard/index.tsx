/* eslint-disable @typescript-eslint/no-explicit-any */
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
  size?: string
  onOpenDetails: () => void
  onClose?: () => void
  onUpdateBook?: (book: BookProps) => void
}

const validStatuses = ['reading', 'read', 'wantToRead', 'didNotFinish'] as const

type ValidStatus = (typeof validStatuses)[number]

export function ExploreCard({ book, onOpenDetails, size = '' }: BookCardProps) {
  const readingStatus = validStatuses.includes(book.readingStatus as any)
    ? (book.readingStatus as ValidStatus)
    : null

  return (
    <BookCardBox onClick={onOpenDetails}>
      <BookCover src={book.coverUrl} />
      <BookContentWrapper>
        <ReadingStatusTag readingStatus={readingStatus} />
        <BookTitleAndAuthor className={size}>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
        </BookTitleAndAuthor>
      </BookContentWrapper>
    </BookCardBox>
  )
}
