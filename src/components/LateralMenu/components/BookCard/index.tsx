import { StarsRating } from '@/components/StarsRating'
import {
  BookContainer,
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

interface Category {
  id: string
  name: string
}

interface BookCardProps {
  name: string
  author: string
  cover_url: string
  rating: number
  total_pages: number
  ratings_number: number
  categories: Category[]
}

export function BookCard({
  name,
  author,
  cover_url,
  rating,
  categories,
  total_pages,
  ratings_number,
}: BookCardProps) {
  const categoryNames = categories.map((category) => category.name)

  return (
    <BookContainer>
      <BookCover alt="" src={cover_url} />
      <BookInfo>
        <BookData>
          <h2>{name}</h2>
          <p>{author}</p>
        </BookData>
        <RatingContainer>
          <StarsRating rating={rating} />
          <p>
            <span>{ratings_number}</span> ratings
          </p>
        </RatingContainer>
      </BookInfo>
      <Separator />
      <Footer>
        <FooterItem>
          <BookmarkSimple />
          <ItemText>
            <p>Category</p>
            <h2>{categoryNames.join(', ')}</h2>
          </ItemText>
        </FooterItem>
        <FooterItem>
          <BookOpen />
          <ItemText>
            <p>Pages</p>
            <h2>{total_pages}</h2>
          </ItemText>
        </FooterItem>
      </Footer>
    </BookContainer>
  )
}
