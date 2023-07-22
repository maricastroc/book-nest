import { StarsRating } from '../StarsRating'
import { BookCover, BookData, BookInfo, Container, ReadNotice } from './styles'

interface PopularBookCardProps {
  cover_url: string
  name: string
  author: string
  rating: number
  alreadyRead: boolean
  onClick: () => void
}

export function PopularBookCard({
  cover_url,
  name,
  author,
  rating,
  alreadyRead,
  ...rest
}: PopularBookCardProps) {
  return (
    <Container {...rest}>
      <BookCover src={cover_url} />
      <BookInfo>
        {alreadyRead && (
          <ReadNotice>
            <p>READ</p>
          </ReadNotice>
        )}
        <BookData>
          <h2>{name}</h2>
          <p>{author}</p>
        </BookData>
        <StarsRating rating={rating} />
      </BookInfo>
    </Container>
  )
}
