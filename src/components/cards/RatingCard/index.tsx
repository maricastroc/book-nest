import { Avatar } from '@/components/shared/Avatar'
import {
  BookContentWrapper,
  BookCover,
  BookSummaryWrapper,
  BookTitleAndAuthor,
  RatingCardBox,
  RatingCardHeader,
  UserNameDateWrapper,
  DividerLine,
  UserDetailsWrapper,
  UserDetailsHeader,
  BookDetailsContainer,
} from './styles'
import { StarsRating } from '@/components/shared/StarsRating'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'
import { useScreenSize } from '@/utils/useScreenSize'
import { ReadNotice } from '@/styles/shared'
import { TextBox } from '@/components/shared/TextBox'

interface RatingCardProps {
  rating: RatingProps
  onOpenDetails: () => void
}

export function RatingCard({
  rating,
  onOpenDetails,
  ...rest
}: RatingCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

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
            avatarUrl={rating.user?.avatarUrl}
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

      {rating?.book && (
        <BookContentWrapper {...rest}>
          <BookDetailsContainer>
            <BookCover
              src={rating.book.coverUrl}
              alt=""
              onClick={onOpenDetails}
            />
            <BookSummaryWrapper>
              <BookTitleAndAuthor>
                <h2>{rating.book.name}</h2>
                <p>{rating.book.author}</p>
              </BookTitleAndAuthor>
              {isMobile ? (
                <StarsRating rating={rating.rate} />
              ) : (
                <TextBox maxHeight="5.8rem" description={rating.description} />
              )}
            </BookSummaryWrapper>
          </BookDetailsContainer>

          {isMobile && (
            <>
              <DividerLine />
              <TextBox maxHeight="5.8rem" description={rating.description} />
            </>
          )}
        </BookContentWrapper>
      )}
    </RatingCardBox>
  )
}
