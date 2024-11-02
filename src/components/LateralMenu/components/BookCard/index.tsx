import { StarsRating } from '@/components/StarsRating'
import {
  BookContainer,
  BookContent,
  BookCover,
  BookData,
  BookInfo,
  Footer,
  FooterItem,
  ItemText,
  RatingContainer,
  Separator,
} from './styles'
import { BookOpen, BookmarkSimple } from 'phosphor-react'
import { CategoryProps } from '@/@types/category'
import { getBookTitle } from '@/utils/getBookTitle'
import { BookProps } from '@/@types/book'

interface BookCardProps {
  book: BookProps
  categories: CategoryProps[]
}

export function BookCard({ book, categories }: BookCardProps) {
  const categoryNames = categories.map((category) => category?.name)

  return (
    <BookContainer>
      <BookContent>
        <BookCover alt="" src={book.coverUrl} />
        <BookInfo>
          <BookData>
            <h2>{getBookTitle(book)}</h2>
            <p>{book.author}</p>
          </BookData>
          <RatingContainer>
            <StarsRating rating={book?.rate ?? 0} />
            <p>
              <span>{book?.ratings?.length ?? 0}</span> {''}
              {book?.ratings?.length === 1 ? 'rating' : 'ratings'}
            </p>
          </RatingContainer>
        </BookInfo>
      </BookContent>
      <Separator />
      <Footer>
        <FooterItem>
          <BookmarkSimple />
          {categories && categoryNames && (
            <ItemText>
              <p>Category</p>
              <h2>{categoryNames.join(', ')}</h2>
            </ItemText>
          )}
        </FooterItem>
        <FooterItem>
          <BookOpen />
          <ItemText>
            <p>Pages</p>
            <h2>{book.totalPages}</h2>
          </ItemText>
        </FooterItem>
      </Footer>
    </BookContainer>
  )
}
