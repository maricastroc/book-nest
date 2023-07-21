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
import { useSession } from 'next-auth/react'

interface RatingCardProps {
  avatar_url: string | null
  name: string | null
  created_at: Date | null
  description: string | null
  rating: number | null
  user: string | null
}

export function RatingCard({
  avatar_url,
  name,
  rating,
  created_at,
  description,
  user,
}: RatingCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(created_at!)

  const session = useSession()

  return (
    <RatingContainer
      className={user === session.data?.user.id ? 'from_user' : ''}
    >
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
