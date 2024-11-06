/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useAppContext, UserStatistics } from '@/contexts/AppContext'
import {
  UserProfileContainer,
  EditProfileButton,
  UserStatText,
  DividerLine,
  UserProfileInfo,
  UserStatsWrapper,
  UserStatItem,
} from './styles'
import { Avatar } from '../shared/Avatar'
import { EditProfileModal } from '../modals/EditProfileModal'
import { SkeletonUserDetails } from '../skeletons/SkeletonUserDetails'
import {
  BookOpen,
  BookmarkSimple,
  Books,
  PencilSimple,
  UserList,
} from 'phosphor-react'

interface UserDetailsProps {
  userId: string
  userStatistics: UserStatistics | undefined
}

interface UserStat {
  icon: JSX.Element
  value: string | number | undefined
  label: string
}

const renderUserStatItem = ({ icon, value, label }: UserStat) => (
  <UserStatItem>
    {icon}
    <UserStatText>
      <h2>{value ?? '-'}</h2>
      <p>{label}</p>
    </UserStatText>
  </UserStatItem>
)

export function UserDetails({ userId, userStatistics }: UserDetailsProps) {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

  const [dateInfo, setDateInfo] = useState({
    dateFormatted: '',
    dateRelativeToNow: '',
    dateString: '',
  })

  const { data: session } = useSession()

  const { loggedUser, isLoading } = useAppContext()

  const userStats: UserStat[] = [
    {
      icon: <BookOpen />,
      value: userStatistics?.readPages,
      label: 'Pages read',
    },
    {
      icon: <Books />,
      value: userStatistics?.ratings?.length,
      label: 'Rated books',
    },
    {
      icon: <UserList />,
      value: userStatistics?.authorsCount,
      label: 'Authors read',
    },
    {
      icon: <BookmarkSimple />,
      value: userStatistics?.bestGenre,
      label: 'Most read category',
    },
  ]

  const getUserAvatarUrl = () => {
    return session?.user.id === userId
      ? loggedUser?.avatarUrl ?? AVATAR_URL_DEFAULT
      : userStatistics?.user.avatarUrl ?? AVATAR_URL_DEFAULT
  }

  const getUserName = () => {
    return session?.user.id === userId
      ? loggedUser?.name
      : userStatistics?.user.name
  }

  useEffect(() => {
    if (userId && userStatistics) {
      const dateFormattedData = getDateFormattedAndRelative(
        userStatistics.user.createdAt,
      )
      setDateInfo(dateFormattedData)
    }
  }, [userId, userStatistics])

  return (
    <UserProfileContainer>
      {isLoading ? (
        <SkeletonUserDetails />
      ) : (
        <>
          <UserProfileInfo>
            <Avatar avatarUrl={getUserAvatarUrl()} variant="large" />
            <h2>{getUserName()}</h2>
            <time title={dateInfo.dateFormatted} dateTime={dateInfo.dateString}>
              joined {dateInfo.dateRelativeToNow}
            </time>
          </UserProfileInfo>

          {session?.user.id === userId && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <EditProfileButton
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(true)}
                >
                  <PencilSimple />
                  Edit Info
                </EditProfileButton>
              </Dialog.Trigger>
              {isEditProfileModalOpen && (
                <EditProfileModal
                  onClose={() => setIsEditProfileModalOpen(false)}
                />
              )}
            </Dialog.Root>
          )}

          <DividerLine />

          <UserStatsWrapper>
            {userStats.map(renderUserStatItem)}
          </UserStatsWrapper>
        </>
      )}
    </UserProfileContainer>
  )
}
