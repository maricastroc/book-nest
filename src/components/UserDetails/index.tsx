/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useAppContext, UserStatistics } from '@/contexts/AppContext'
import {
  Container,
  EditUserBtn,
  ItemText,
  Separator,
  UserInfo,
  UserInfoContainer,
  UserInfoItem,
} from './styles'
import { Avatar } from '../Avatar'
import { EditUserModal } from '../EditUserModal'
import { SkeletonUserDetails } from '../SkeletonUserDetails'
import {
  BookOpen,
  BookmarkSimple,
  Books,
  PencilSimple,
  UserList,
} from 'phosphor-react'

interface UserDetailsProps {
  userId: string
}

export function UserDetails({ userId }: UserDetailsProps) {
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)

  const [userStatistics, setUserStatistics] = useState<
    UserStatistics | undefined
  >(undefined)

  const [dateInfo, setDateInfo] = useState({
    dateFormatted: '',
    dateRelativeToNow: '',
    dateString: '',
  })

  const { data: session } = useSession()

  const { loggedUser, fetchUserStatistics, isLoading } = useAppContext()

  useEffect(() => {
    if (userId) {
      const loadUserStatistics = async () => {
        const statistics = await fetchUserStatistics(userId)

        setUserStatistics(statistics)

        if (statistics?.user.createdAt) {
          const dateFormattedData = getDateFormattedAndRelative(
            statistics.user.createdAt,
          )
          setDateInfo(dateFormattedData)
        }
      }
      loadUserStatistics()
    }
  }, [userId, session?.user.id])

  const userAvatarUrl =
    session?.user.id === userId
      ? loggedUser?.avatarUrl ?? AVATAR_URL_DEFAULT
      : userStatistics?.user.avatarUrl ?? AVATAR_URL_DEFAULT

  const userName =
    session?.user.id === userId ? loggedUser?.name : userStatistics?.user.name

  return (
    <Container>
      {isLoading ? (
        <SkeletonUserDetails />
      ) : (
        <>
          <UserInfo>
            <Avatar avatarUrl={userAvatarUrl} variant="large" />
            <h2>{userName}</h2>
            <time title={dateInfo.dateFormatted} dateTime={dateInfo.dateString}>
              joined {dateInfo.dateRelativeToNow}
            </time>
          </UserInfo>

          {session?.user.id === userId && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <EditUserBtn
                  type="button"
                  onClick={() => setIsEditUserModalOpen(true)}
                >
                  <PencilSimple />
                  Edit Info
                </EditUserBtn>
              </Dialog.Trigger>
              {isEditUserModalOpen && (
                <EditUserModal onClose={() => setIsEditUserModalOpen(false)} />
              )}
            </Dialog.Root>
          )}

          <Separator />

          <UserInfoContainer>
            <UserInfoItem>
              <BookOpen />
              <ItemText>
                <h2>{userStatistics?.readPages}</h2>
                <p>Pages read</p>
              </ItemText>
            </UserInfoItem>
            <UserInfoItem>
              <Books />
              <ItemText>
                <h2>{userStatistics?.ratings?.length ?? 0}</h2>
                <p>Rated books</p>
              </ItemText>
            </UserInfoItem>
            <UserInfoItem>
              <UserList />
              <ItemText>
                <h2>{userStatistics?.authorsCount ?? 0}</h2>
                <p>Authors read</p>
              </ItemText>
            </UserInfoItem>
            <UserInfoItem>
              <BookmarkSimple />
              <ItemText>
                <h2>{userStatistics?.bestGenre ?? '-'}</h2>
                <p>Most read category</p>
              </ItemText>
            </UserInfoItem>
          </UserInfoContainer>
        </>
      )}
    </Container>
  )
}
