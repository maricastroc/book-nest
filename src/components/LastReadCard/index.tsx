import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { StarsRating } from '../StarsRating'
import {
  BookCover,
  BookData,
  BookDescription,
  BookInfo,
  BookTitle,
  Container,
  TimeAndRating,
} from './styles'
import { Book, Rating } from '@prisma/client'

interface LastReadCardProps {
  book: Book
  rating: Rating
}

export function LastReadCard({ book, rating }: LastReadCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.created_at)

  return (
    <Container>
      <BookCover src={book.cover_url} />
      <BookInfo>
        <BookData>
          <BookTitle>
            <h2>{book.name}</h2>
            <p>{book.author}</p>
          </BookTitle>
          <BookDescription>
            <p>{rating.description}</p>
          </BookDescription>
        </BookData>
        <TimeAndRating>
          <StarsRating rating={rating.rate} />
          <time title={dateFormatted} dateTime={dateString}>
            {dateRelativeToNow}
          </time>
        </TimeAndRating>
      </BookInfo>
    </Container>
  )
}
