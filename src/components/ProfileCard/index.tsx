import {
  BookContainer,
  BookCover,
  BookDetails,
  BookDescription,
  BookInfo,
  Container,
  Separator,
  ReadNotice,
  Heading,
  Wrapper,
  BookInfoText,
  BookData,
} from './styles'
import { StarsRating } from '../StarsRating'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { RatingProps } from '@/@types/rating'
import { BookProps } from '@/@types/book'

interface ProfileCardProps {
  book: BookProps
  rating: RatingProps
}

export function ProfileCard({ book, rating }: ProfileCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  return (
    <Wrapper>
      <Heading>
        <time title={dateFormatted} dateTime={dateString}>
          {dateRelativeToNow}
        </time>
      </Heading>
      <Container>
        {rating?.book?.alreadyRead && (
          <ReadNotice>
            <p>READ</p>
          </ReadNotice>
        )}
        <BookContainer>
          <BookDetails>
            <BookData>
              <BookCover src={book.coverUrl} alt="" />
              <BookInfo>
                <BookInfoText>
                  <h2>{book.name}</h2>
                  <p>{book.author}</p>
                </BookInfoText>
                <StarsRating rating={rating.rate} />
              </BookInfo>
            </BookData>
            <Separator />
            <BookDescription>
              <p>{rating.description}</p>
            </BookDescription>
          </BookDetails>
        </BookContainer>
      </Container>
    </Wrapper>
  )
}
