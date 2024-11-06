import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { StarsRating } from '@/components/shared/StarsRating'
import {
  BookCover,
  ReviewInfoSection,
  UserReviewContainer,
  UserReviewWrapper,
  BookTitleAndAuthor,
  UserLatestReadingCardWrapper,
  TimeAndRating,
} from './styles'
import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'

interface UserLatestReadingCardProps {
  book: BookProps
  rating: RatingProps
}

export function UserLatestReadingCard({
  book,
  rating,
}: UserLatestReadingCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  return (
    <UserLatestReadingCardWrapper>
      <BookCover src={book.coverUrl} />
      <UserReviewWrapper>
        <ReviewInfoSection>
          <BookTitleAndAuthor>
            <h2>{book.name}</h2>
            <p>{book.author}</p>
          </BookTitleAndAuthor>
          <UserReviewContainer>
            <p>{rating.description}</p>
          </UserReviewContainer>
        </ReviewInfoSection>
        <TimeAndRating>
          <StarsRating rating={rating.rate} />
          <time title={dateFormatted} dateTime={dateString}>
            {dateRelativeToNow}
          </time>
        </TimeAndRating>
      </UserReviewWrapper>
    </UserLatestReadingCardWrapper>
  )
}
