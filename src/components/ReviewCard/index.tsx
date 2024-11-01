import { Avatar } from '../Avatar'
import {
  BookContainer,
  BookCover,
  BookDetails,
  ReviewContainer,
  BookInfo,
  Container,
  Header,
  NameAndDate,
  Separator,
  UserInfo,
  ReadNotice,
} from './styles'
import { StarsRating } from '../StarsRating'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'

interface ReviewCardProps {
  rating: RatingProps
  onClick: () => void
}

export function ReviewCard({ rating, ...rest }: ReviewCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const avatarUrl = rating.user.avatarUrl || 'https://github/octocat.png'

  const router = useRouter()

  return (
    <Container>
      {rating?.book.alreadyRead && (
        <ReadNotice>
          <p>READ</p>
        </ReadNotice>
      )}
      <Header>
        <UserInfo>
          <Avatar
            avatarUrl={avatarUrl}
            onClick={() => {
              router.push(`/profile/${rating.user.id}`)
            }}
          />
          <NameAndDate>
            <p>{rating.user.name}</p>
            <time title={dateFormatted} dateTime={dateString}>
              {dateRelativeToNow}
            </time>
          </NameAndDate>
        </UserInfo>
        <StarsRating rating={rating.rate} />
      </Header>
      <Separator />
      <BookContainer {...rest}>
        <BookCover src={rating.book.coverUrl} alt="" />
        <BookDetails>
          <BookInfo>
            <h2>{rating.book.name}</h2>
            <p>{rating.book.author}</p>
          </BookInfo>
          <Separator />
          <ReviewContainer>
            <p>{rating.description}</p>
          </ReviewContainer>
        </BookDetails>
      </BookContainer>
    </Container>
  )
}
