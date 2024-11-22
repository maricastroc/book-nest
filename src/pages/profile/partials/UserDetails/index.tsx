import { useEffect, useState, useMemo } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useAppContext, UserStatistics } from '@/contexts/AppContext'
import {
  UserProfileContainer,
  UserStatText,
  UserProfileInfo,
  UserStatsWrapper,
  UserStatItem,
} from './styles'
import { Avatar } from '../../../../components/shared/Avatar'
import { EditProfileModal } from '../../../../components/modals/EditProfileModal'
import { SkeletonUserDetails } from '../SkeletonUserDetails'
import {
  BookOpen,
  BookmarkSimple,
  Books,
  PencilSimple,
  UserList,
} from 'phosphor-react'
import { useRouter } from 'next/router'
import { ActionButton, DividerLine } from '@/styles/shared'

interface UserDetailsProps {
  userId: string
  userStatistics: UserStatistics | undefined
  isLoading: boolean
}

interface UserStat {
  icon: JSX.Element
  value: string | number | undefined
  label: string
}

const UserStatItemComponent = ({ icon, value, label }: UserStat) => (
  <UserStatItem>
    {icon}
    <UserStatText>
      <h2>{value ?? '-'}</h2>
      <p>{label}</p>
    </UserStatText>
  </UserStatItem>
)

export function UserDetails({
  userId,
  userStatistics,
  isLoading,
}: UserDetailsProps) {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

  const router = useRouter()

  const [dateInfo, setDateInfo] = useState({
    dateFormatted: '',
    dateRelativeToNow: '',
    dateString: '',
  })

  const { loggedUser } = useAppContext()

  const isCurrentUser = useMemo(
    () => loggedUser?.id === userId,
    [loggedUser, userId],
  )

  const userAvatarUrl = isCurrentUser
    ? loggedUser?.avatarUrl ?? AVATAR_URL_DEFAULT
    : userStatistics?.user.avatarUrl ?? AVATAR_URL_DEFAULT

  const userName = isCurrentUser ? loggedUser?.name : userStatistics?.user.name

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

  useEffect(() => {
    if (userId && userStatistics && userStatistics?.user?.createdAt) {
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
            <Avatar avatarUrl={userAvatarUrl} variant="large" />
            <h2>{userName}</h2>
            <time title={dateInfo.dateFormatted} dateTime={dateInfo.dateString}>
              joined {dateInfo.dateRelativeToNow}
            </time>
          </UserProfileInfo>

          {isCurrentUser ? (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <ActionButton
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(true)}
                >
                  <PencilSimple />
                  Edit Info
                </ActionButton>
              </Dialog.Trigger>
              {isEditProfileModalOpen && (
                <EditProfileModal
                  onClose={() => setIsEditProfileModalOpen(false)}
                />
              )}
            </Dialog.Root>
          ) : (
            <ActionButton onClick={() => router.push(`/library/${userId}`)}>
              View Library
            </ActionButton>
          )}

          <DividerLine />

          <UserStatsWrapper>
            {userStats.map((stat, index) => (
              <UserStatItemComponent key={index} {...stat} />
            ))}
          </UserStatsWrapper>
        </>
      )}
    </UserProfileContainer>
  )
}
