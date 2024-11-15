import { UserProps } from '@/@types/user'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import {
  AvatarContainer,
  AvatarDefault,
  LinksContainer,
  NameAndTime,
  UserCardBox,
  UserContentWrapper,
} from './styles'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'

interface UserCardProps {
  user: UserProps
}

export function UserCard({ user }: UserCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(user.createdAt)

  return (
    <UserCardBox>
      <AvatarContainer>
        <AvatarDefault src={user.avatarUrl ?? AVATAR_URL_DEFAULT} />
      </AvatarContainer>
      <UserContentWrapper>
        <NameAndTime>
          <h2>{user.name}</h2>
          <time title={dateFormatted} dateTime={dateString}>
            joined {dateRelativeToNow}
          </time>
        </NameAndTime>
        <LinksContainer>
          <a href={`profile/${user.id}`}>profile</a>
          <p>|</p>
          <a href={`library/${user.id}`}>library</a>
        </LinksContainer>
      </UserContentWrapper>
    </UserCardBox>
  )
}
