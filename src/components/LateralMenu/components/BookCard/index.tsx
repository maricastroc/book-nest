import { StarsRating } from '@/components/StarsRating'
import {
  BookCardWrapper,
  BookCardContent,
  BookCover,
  BookTitleAndAuthor,
  BookDetailsWrapper,
  BookSummary,
  BookStatsWrapper,
  StatWrapper,
  StatText,
  BookRatingInfo,
  DividerLine,
} from './styles'
import { BookOpen, BookmarkSimple, CalendarBlank } from 'phosphor-react'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'

interface BookCardProps {
  book: BookProps
  categories: CategoryProps[]
}

export function BookCard({ book, categories }: BookCardProps) {
  const categoryNames = categories.map((category) => category?.name)

  return (
    <BookCardWrapper>
      <BookCardContent>
        <BookCover alt="" src={book.coverUrl} />
        <BookDetailsWrapper>
          <BookTitleAndAuthor>
            <h2>{book.name}</h2>
            <p>{book.author}</p>
          </BookTitleAndAuthor>
          <BookRatingInfo>
            <StarsRating rating={book?.rate ?? 0} />
            <p>
              <span>{book?.ratings?.length ?? 0}</span> {''}
              {book?.ratings?.length === 1 ? 'rating' : 'ratings'}
            </p>
          </BookRatingInfo>
        </BookDetailsWrapper>
      </BookCardContent>
      <DividerLine />
      <BookSummary>
        <p>{book.summary}</p>
      </BookSummary>
      <DividerLine />
      <BookStatsWrapper>
        <StatWrapper>
          <BookmarkSimple />
          {categories && categoryNames && (
            <StatText>
              <p>Category</p>
              <h2>{categoryNames.join(', ')}</h2>
            </StatText>
          )}
        </StatWrapper>
        <StatWrapper>
          <BookOpen />
          <StatText>
            <p>Pages</p>
            <h2>{book.totalPages}</h2>
          </StatText>
        </StatWrapper>
        <StatWrapper>
          <CalendarBlank />
          <StatText>
            <p>Published on</p>
            <h2>{book.publishingYear}</h2>
          </StatText>
        </StatWrapper>
      </BookStatsWrapper>
    </BookCardWrapper>
  )
}
