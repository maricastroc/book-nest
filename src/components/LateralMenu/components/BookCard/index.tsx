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

interface BookCardProps {
  name: string
  author: string
  coverUrl: string
  rating: number
  totalPages: number
  ratingsNumber: number
  categories?: CategoryProps[] | undefined
}

export function BookCard({
  name,
  author,
  coverUrl,
  rating,
  categories,
  totalPages,
  ratingsNumber,
}: BookCardProps) {
  const categoryNames = categories?.map((category) => category?.name)

  return (
    <BookContainer>
      <BookContent>
        <BookCover alt="" src={coverUrl} />
        <BookInfo>
          <BookData>
            <h2>{name}</h2>
            <p>{author}</p>
          </BookData>
          <RatingContainer>
            <StarsRating rating={rating} />
            <p>
              <span>{ratingsNumber}</span> {''}
              {ratingsNumber === 1 ? 'rating' : 'ratings'}
            </p>
          </RatingContainer>
        </BookInfo>
      </BookContent>
      <Separator />
      <Footer>
        <FooterItem>
          <BookmarkSimple />
          {(categories && categoryNames) && (
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
            <h2>{totalPages}</h2>
          </ItemText>
        </FooterItem>
      </Footer>
    </BookContainer>
  )
}
