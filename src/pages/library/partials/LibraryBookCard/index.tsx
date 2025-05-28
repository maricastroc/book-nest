import { BookProps } from '@/@types/book'
import {
  BookCover,
  BookTitleAndAuthor,
  BookContentWrapper,
  BookCardBox,
} from './styles'
import { StarsRating } from '@/components/shared/StarsRating'

interface BookCardProps {
  book: BookProps
  onSelect: (value: BookProps) => void
  size?: string
  onClose?: () => void
}

export function LibraryBookCard({ book, onSelect, size = '' }: BookCardProps) {
  return (
    <BookCardBox
      onClick={() => {
        onSelect(book)
      }}
    >
      <BookCover src={book.coverUrl} onClick={() => onSelect(book)} />
      <BookContentWrapper>
        <BookTitleAndAuthor className={size}>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
          <StarsRating size="smaller" rating={book?.userRating || 0} />
        </BookTitleAndAuthor>
      </BookContentWrapper>
    </BookCardBox>
  )
}
