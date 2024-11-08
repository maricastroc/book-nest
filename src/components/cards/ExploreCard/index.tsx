import { BookProps } from '@/@types/book'
import { StarsRating } from '@/components/shared/StarsRating'
import {
  BookCover,
  BookData,
  BookInfo,
  Container,
  InfosContainer,
} from './styles'
import { getBookTitle } from '@/utils/getBookTitle'
import { getBookRatingsNumber } from '@/utils/getBookRatingsNumber'
import { ReadNotice } from '@/styles/shared'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'

interface ExploreCardProps {
  book: BookProps
  onClick: () => void
}

export function ExploreCard({ book, ...rest }: ExploreCardProps) {
  return (
    <Container {...rest}>
      <BookCover alt="" src={book.coverUrl} />
      <BookInfo>
        {book.alreadyRead && (
          <ReadNotice>
            <FontAwesomeIcon icon={faBookmark} />
          </ReadNotice>
        )}
        <BookData>
          <h2>{getBookTitle(book)}</h2>
          <p>{book.author}</p>
        </BookData>
        <InfosContainer>
          <p>{getBookRatingsNumber(book)}</p>
          <StarsRating rating={book?.rate ?? 0} />
        </InfosContainer>
      </BookInfo>
    </Container>
  )
}
