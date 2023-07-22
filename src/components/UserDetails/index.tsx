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
  avatar_url: string
  name: string
  created_at: Date
  total_pages: number
  books_rated: number
  authors_read: number
  most_read_category: string
}

export function UserDetails({
  avatar_url,
  name,
  created_at,
  total_pages,
  books_rated,
  authors_read,
  most_read_category,
}: UserDetailsProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(created_at)

  return (
    <Container>
      <UserInfo>
        <AvatarContainer>
          <AvatarDefault alt="" src={avatar_url} />
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
            <h2>{total_pages}</h2>
            <p>Pages read</p>
          </ItemText>
        </UserInfoItem>
        <UserInfoItem>
          <Books />
          <ItemText>
            <h2>{books_rated}</h2>
            <p>Rated books</p>
          </ItemText>
        </UserInfoItem>
        <UserInfoItem>
          <UserList />
          <ItemText>
            <h2>{authors_read}</h2>
            <p>Authors read</p>
          </ItemText>
        </UserInfoItem>
        <UserInfoItem>
          <BookmarkSimple />
          <ItemText>
            <h2>{most_read_category}</h2>
            <p>Most read category</p>
          </ItemText>
        </UserInfoItem>
      </UserInfoContainer>
    </Container>
  )
}
