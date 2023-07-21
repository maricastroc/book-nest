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
import { BookOpen } from 'phosphor-react'

interface UserDetailsProps {
  avatar_url: string
  name: string
  created_at: Date
  total_pages: number
  rated_books: number
  read_authors: number
  most_read_category: string
}

export function UserDetails({
  avatar_url,
  name,
  created_at,
  total_pages,
  rated_books,
  read_authors,
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
          member {dateRelativeToNow}
        </time>
      </UserInfo>
      <Separator />
      <UserInfoContainer>
        <UserInfoItem>
          <BookOpen />
          <ItemText>
            <h2>{total_pages}</h2>
            <p>Read pages</p>
          </ItemText>
        </UserInfoItem>
        <UserInfoItem>
          <BookOpen />
          <ItemText>
            <h2>{rated_books}</h2>
            <p>Rated books</p>
          </ItemText>
        </UserInfoItem>
        <UserInfoItem>
          <BookOpen />
          <ItemText>
            <h2>{read_authors}</h2>
            <p>Read authors</p>
          </ItemText>
        </UserInfoItem>
        <UserInfoItem>
          <BookOpen />
          <ItemText>
            <h2>{most_read_category}</h2>
            <p>Most read category</p>
          </ItemText>
        </UserInfoItem>
      </UserInfoContainer>
    </Container>
  )
}
