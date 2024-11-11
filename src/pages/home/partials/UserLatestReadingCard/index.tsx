import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { StarsRating } from '@/components/shared/StarsRating'
import {
  UserCardContent,
  BookCover,
  BookSummaryWrapper,
  BookTitleAndAuthor,
  UserLatestReadingCardWrapper,
  UserCardHeader,
  DividerLine,
  BookDetailsContainer,
} from './styles'
import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import { TextBox } from '@/components/shared/TextBox'
import { useScreenSize } from '@/utils/useScreenSize'

interface UserLatestReadingCardProps {
  book: BookProps
  rating: RatingProps
  onOpenDetails: () => void
}

export function UserLatestReadingCard({
  book,
  rating,
  onOpenDetails,
}: UserLatestReadingCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const isMobile = useScreenSize(480)

  return (
    <UserLatestReadingCardWrapper>
      <UserCardHeader>
        <time title={dateFormatted} dateTime={dateString}>
          {dateRelativeToNow}
        </time>
        <StarsRating rating={rating.rate} />
      </UserCardHeader>

      {book && (
        <UserCardContent>
          <BookDetailsContainer>
            <BookCover src={book.coverUrl} alt="" onClick={onOpenDetails} />
            <BookSummaryWrapper>
              <BookTitleAndAuthor>
                <h2>{book.name}</h2>
                <p>{book.author}</p>
              </BookTitleAndAuthor>
              {!isMobile && (
                <TextBox maxHeight="5.8rem" description={rating.description} />
              )}
            </BookSummaryWrapper>
          </BookDetailsContainer>

          {isMobile && (
            <>
              <DividerLine />
              <TextBox maxHeight="5.8rem" description={rating.description} />
            </>
          )}
        </UserCardContent>
      )}
    </UserLatestReadingCardWrapper>
  )
}
