import { Avatar } from '../Avatar'
import {
  BookContentWrapper,
  BookCover,
  BookSummaryWrapper,
  RatingContainer,
  BookTitleAndAuthor,
  RatingCardBox,
  RatingCardHeader,
  UserNameDateWrapper,
  DividerLine,
  UserDetailsWrapper,
  UserDetailsHeader,
  BookDetailsContainer,
} from './styles'
import { StarsRating } from '../StarsRating'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'
import { useScreenSize } from '@/utils/useScreenSize'
import { ReadNotice } from '@/styles/shared'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'

interface RatingCardProps {
  rating: RatingProps
}

export function RatingCard({ rating, ...rest }: RatingCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const avatarUrl = rating.user.avatarUrl || AVATAR_URL_DEFAULT

  const router = useRouter()

  const isMobile = useScreenSize(480)

  return (
    <RatingCardBox>
      {rating?.book && rating?.book.alreadyRead && (
        <ReadNotice>
          <p>READ</p>
        </ReadNotice>
      )}

      <RatingCardHeader>
        <UserDetailsWrapper>
          <Avatar
            variant="bigger"
            isClickable
            avatarUrl={avatarUrl}
            onClick={() => {
              router.push(`/profile/${rating.user.id}`)
            }}
          />
          <UserDetailsHeader>
            <UserNameDateWrapper>
              <p>{rating.user.name}</p>
              <time title={dateFormatted} dateTime={dateString}>
                {dateRelativeToNow}
              </time>
            </UserNameDateWrapper>
            {!isMobile && <StarsRating rating={rating.rate} />}
          </UserDetailsHeader>
        </UserDetailsWrapper>
      </RatingCardHeader>

      <DividerLine className="larger" />

      {rating?.book && (
        <BookContentWrapper {...rest}>
          <BookDetailsContainer>
            <BookCover src={rating.book.coverUrl} alt="" />
            <BookSummaryWrapper>
              <BookTitleAndAuthor>
                <h2>{rating.book.name}</h2>
                <p>{rating.book.author}</p>
              </BookTitleAndAuthor>
              {isMobile ? (
                <StarsRating rating={rating.rate} />
              ) : (
                <RatingContainer>
                  <p>{rating.description}</p>
                </RatingContainer>
              )}
            </BookSummaryWrapper>
          </BookDetailsContainer>

          {isMobile && (
            <>
              <DividerLine />
              <RatingContainer>
                <p>{rating.description}</p>
              </RatingContainer>
            </>
          )}
        </BookContentWrapper>
      )}
    </RatingCardBox>
  )
}
