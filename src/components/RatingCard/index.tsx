import { Avatar } from '../Avatar'
import {
  BookContainer,
  BookCover,
  BookDetails,
  RatingContainer,
  BookInfo,
  Container,
  Header,
  NameAndDate,
  Separator,
  UserInfo,
  ReadNotice,
  HeaderData,
  BookData,
} from './styles'
import { StarsRating } from '../StarsRating'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'
import { useScreenSize } from '@/utils/useScreenSize'

interface RatingCardProps {
  rating: RatingProps
}

export function RatingCard({ rating, ...rest }: RatingCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const avatarUrl = rating.user.avatarUrl || 'https://github/octocat.png'

  const router = useRouter()

  const isMobile = useScreenSize(480)

  return (
    <Container>
      {rating?.book && rating?.book.alreadyRead && (
        <ReadNotice>
          <p>READ</p>
        </ReadNotice>
      )}
      <Header>
        <UserInfo>
          <Avatar
            variant="bigger"
            isClickable
            avatarUrl={avatarUrl}
            onClick={() => {
              router.push(`/profile/${rating.user.id}`)
            }}
          />

          <HeaderData>
            <NameAndDate>
              <p>{rating.user.name}</p>
              <time title={dateFormatted} dateTime={dateString}>
                {dateRelativeToNow}
              </time>
            </NameAndDate>
            {!isMobile && <StarsRating rating={rating.rate} />}
          </HeaderData>
        </UserInfo>
      </Header>
      <Separator className="larger" />
      {rating?.book && (
        <BookContainer {...rest}>
          <BookData>
            <BookCover src={rating.book.coverUrl} alt="" />
            <BookDetails>
              <BookInfo>
                <h2>{rating.book.name}</h2>
                <p>{rating.book.author}</p>
              </BookInfo>
              {isMobile && <StarsRating rating={rating.rate} />}
              {!isMobile && (
                <RatingContainer>
                  <p>{rating.description}</p>
                </RatingContainer>
              )}
            </BookDetails>
          </BookData>
          {isMobile && (
            <>
              <Separator />
              <RatingContainer>
                <p>{rating.description}</p>
              </RatingContainer>
            </>
          )}
        </BookContainer>
      )}
    </Container>
  )
}
