/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import {
  AvatarContainer,
  AvatarDefault,
  BookDescription,
  Header,
  NameAndDate,
  RatingContainer,
  UserData,
} from './styles'
import { StarsRating } from '@/components/StarsRating'

interface RatingCardProps {
  avatar_url: string | null
  name: string | null
  created_at: Date | null
  description: string | null
  rating: number | null
}

export function RatingCard({
  avatar_url,
  name,
  rating,
  created_at,
  description,
}: RatingCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(created_at!)

  return (
    <RatingContainer>
      <Header>
        <UserData>
          <AvatarContainer>
            <AvatarDefault alt="" src={avatar_url!} />
          </AvatarContainer>
          <NameAndDate>
            <p>{name}</p>
            <time title={dateFormatted} dateTime={dateString}>
              {dateRelativeToNow}
            </time>
          </NameAndDate>
        </UserData>
        <StarsRating rating={rating!} />
      </Header>
      <BookDescription>
        <p>{description}</p>
      </BookDescription>
    </RatingContainer>
  )
}
