import { BookProps } from '@/@types/book'
import { StarsRating } from '@/components/shared/StarsRating'
import {
  BookCover,
  BookTitleAndAuthor,
  BookContentWrapper,
  PopularBookCardBox,
  RatingWrapper,
} from './styles'
import { getBookRatingsNumber } from '@/utils/getBookRatingsNumber'
import { ReadNotice } from '@/styles/shared'

interface PopularBookCardProps {
  book: BookProps
  onOpenDetails: () => void
}

export function PopularBookCard({ book, onOpenDetails }: PopularBookCardProps) {
  return (
    <PopularBookCardBox onClick={() => onOpenDetails()}>
      <BookCover src={book.coverUrl} />
      <BookContentWrapper>
        {book.alreadyRead && (
          <ReadNotice>
            <p>READ</p>
          </ReadNotice>
        )}
        <BookTitleAndAuthor>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
        </BookTitleAndAuthor>
        <RatingWrapper>
          <p>{getBookRatingsNumber(book)}</p>
          <StarsRating rating={book?.rate ?? 0} />
        </RatingWrapper>
      </BookContentWrapper>
    </PopularBookCardBox>
  )
}
