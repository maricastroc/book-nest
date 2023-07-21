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
} from './styles'
import { Book } from '@prisma/client'
import { RatingWithUserAndBook } from '@/pages/home/index.page'
import { StarsRating } from '../StarsRating'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'

interface ProfileCardProps {
  book: Book
  rating: RatingWithUserAndBook
}

export function ProfileCard({ book, rating }: ProfileCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.created_at)

  return (
    <Wrapper>
      <Heading>
        <time title={dateFormatted} dateTime={dateString}>
          {dateRelativeToNow}
        </time>
      </Heading>
      <Container>
        {rating.alreadyRead && (
          <ReadNotice>
            <p>READ</p>
          </ReadNotice>
        )}
        <BookContainer>
          <BookCover src={book.cover_url} alt="" />
          <BookDetails>
            <BookInfo>
              <BookInfoText>
                <h2>{book.name}</h2>
                <p>{book.author}</p>
              </BookInfoText>
              <StarsRating rating={rating.rate} />
            </BookInfo>
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
