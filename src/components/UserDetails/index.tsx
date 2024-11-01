import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import {
  AvatarContainer,
  AvatarDefault,
  Container,
  ItemText,
  Separator,
  UserInfo,
  UserInfoContainer,
  UserInfoItem,
} from './styles'
import { BookOpen, BookmarkSimple, Books, UserList } from 'phosphor-react'

interface UserDetailsProps {
  avatarUrl: string
  name: string
  createdAt: Date
  totalPages: number
  booksRated: number
  authorsRead: number
  bestGenre: string
}

export function UserDetails({
  avatarUrl,
  name,
  createdAt,
  totalPages,
  booksRated,
  authorsRead,
  bestGenre,
}: UserDetailsProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(createdAt)

  return (
    <Container>
      <UserInfo>
        <AvatarContainer>
          <AvatarDefault alt="" src={avatarUrl} />
        </AvatarContainer>
        <h2>{name}</h2>
        <time title={dateFormatted} dateTime={dateString}>
          joined {dateRelativeToNow}
        </time>
      </UserInfo>
      <Separator />
      <UserInfoContainer>
        <UserInfoItem>
          <BookOpen />
          <ItemText>
            <h2>{totalPages}</h2>
            <p>Pages read</p>
          </ItemText>
        </UserInfoItem>
        <UserInfoItem>
          <Books />
          <ItemText>
            <h2>{booksRated}</h2>
            <p>Rated books</p>
          </ItemText>
        </UserInfoItem>
        <UserInfoItem>
          <UserList />
          <ItemText>
            <h2>{authorsRead}</h2>
            <p>Authors read</p>
          </ItemText>
        </UserInfoItem>
        <UserInfoItem>
          <BookmarkSimple />
          <ItemText>
            <h2>{bestGenre}</h2>
            <p>Most read category</p>
          </ItemText>
        </UserInfoItem>
      </UserInfoContainer>
    </Container>
  )
}
