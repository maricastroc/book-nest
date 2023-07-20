import { StarsRating } from '../StarsRating'
import { BookCover, BookData, BookInfo, Container, ReadNotice } from './styles'

interface ExploreCardProps {
  cover_url: string
  name: string
  author: string
  rating: number
  alreadyRead: boolean
  onClick: () => void
}

export function ExploreCard({
  cover_url,
  name,
  author,
  rating,
  alreadyRead,
  ...rest
}: ExploreCardProps) {
  return (
    <Container {...rest}>
      <BookCover alt="" src={cover_url} />
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
