import { BookProps } from '@/@types/book'
import { StarsRating } from '../StarsRating'
import { BookCover, BookData, BookInfo, Container, ReadNotice } from './styles'

interface PopularBookCardProps {
  book: BookProps
  onOpenDetails: () => void
}

export function PopularBookCard({ book, onOpenDetails }: PopularBookCardProps) {
  return (
    <Container onClick={() => onOpenDetails()}>
      <BookCover src={book.coverUrl} />
      <BookInfo>
        {book.alreadyRead && (
          <ReadNotice>
            <p>READ</p>
          </ReadNotice>
        )}
        <BookData>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
        </BookData>
        <StarsRating rating={book.rate} />
      </BookInfo>
    </Container>
  )
}
