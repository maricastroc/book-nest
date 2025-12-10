import { UserProps } from '@/@types/user'
import {
  AvatarContainer,
  LinksContainer,
  NameAndTime,
  UserCardBox,
  UserContentWrapper,
} from './styles'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import AvatarDefaultImage from '../../../../../public/assets/avatar_mockup.png'
import Image from 'next/image'

interface UserCardProps {
  user: UserProps
}

export function UserCard({ user }: UserCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(user?.createdAt || '')

  return (
    <UserCardBox>
      <AvatarContainer>
        <Image
          priority
          width={50}
          height={50}
          src={user.avatarUrl || AvatarDefaultImage.src}
          alt="User Profile Photo"
        />
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
