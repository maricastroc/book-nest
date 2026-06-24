import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import * as Dialog from '@radix-ui/react-dialog'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useAppContext } from '@/contexts/AppContext'
import {
  UserProfileContainer,
  UserStatText,
  UserProfileInfo,
  UserStatsWrapper,
  UserStatItem,
  UserActionsWrapper,
  FollowCountsRow,
} from './styles'
import { Avatar } from '../../../../components/shared/Avatar'
import { SkeletonUserDetails } from '../SkeletonUserDetails'
import { BookOpen, BookmarkSimple, Books, UserList } from 'phosphor-react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/Button'
import { UserStatistics } from '@/@types/user_statistics'
import { DividerLine } from '@/components/ui/DividerLine'
import { useFollowStatus } from '@/hooks/useFollowStatus'
import { FollowListModal } from '@/components/modals/FollowListModal'

const EditProfileModal = dynamic(
  () =>
    import('../../../../components/modals/EditProfileModal').then(
      (m) => m.EditProfileModal,
    ),
  { ssr: false },
)

interface UserDetailsProps {
  userId?: string
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
  const [followListModal, setFollowListModal] = useState<
    'followers' | 'following' | null
  >(null)

  const router = useRouter()

  const {
    followersCount,
    followingCount,
    isFollowing,
    isTogglingFollow,
    toggleFollow,
  } = useFollowStatus(userId)

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
    ? loggedUser?.avatarUrl
    : userStatistics?.user.avatarUrl

  const userName = isCurrentUser ? loggedUser?.name : userStatistics?.user.name

  const userStats: UserStat[] = [
    {
      icon: <BookOpen />,
      value: userStatistics?.readPages,
      label: 'Pages read',
    },
    {
      icon: <Books />,
      value: userStatistics?.ratedBooks,
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
    <>
      <UserProfileContainer>
        {isLoading ? (
          <SkeletonUserDetails />
        ) : (
          <>
            <UserProfileInfo>
              <Avatar avatarUrl={userAvatarUrl} variant="large" />
              <h2>{userName}</h2>
              <time
                title={dateInfo.dateFormatted}
                dateTime={dateInfo.dateString}
              >
                joined {dateInfo.dateRelativeToNow}
              </time>
            </UserProfileInfo>

            {isCurrentUser ? (
              <UserActionsWrapper>
                <FollowCountsRow>
                  <span
                    onClick={() => setFollowListModal('followers')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{followersCount}</strong> followers
                  </span>
                  <span
                    onClick={() => setFollowListModal('following')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{followingCount}</strong> following
                  </span>
                </FollowCountsRow>
                <Dialog.Root open={isEditProfileModalOpen}>
                  <Dialog.Trigger asChild>
                    <Button
                      isSmaller
                      type="button"
                      content="Edit Info"
                      onClick={() => setIsEditProfileModalOpen(true)}
                      style={{ width: '100%' }}
                    />
                  </Dialog.Trigger>
                  {isEditProfileModalOpen && (
                    <EditProfileModal
                      onClose={() => setIsEditProfileModalOpen(false)}
                    />
                  )}
                </Dialog.Root>
              </UserActionsWrapper>
            ) : (
              <UserActionsWrapper>
                <FollowCountsRow>
                  <span
                    onClick={() => setFollowListModal('followers')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{followersCount}</strong> followers
                  </span>
                  <span
                    onClick={() => setFollowListModal('following')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{followingCount}</strong> following
                  </span>
                </FollowCountsRow>
                <Button
                  isSmaller
                  content={
                    isTogglingFollow
                      ? 'Loading...'
                      : isFollowing
                      ? 'Unfollow'
                      : 'Follow'
                  }
                  onClick={toggleFollow}
                  variant={'default'}
                  style={{ width: '100%' }}
                />
                <Button
                  isSmaller
                  content="View Library"
                  variant="outline-white"
                  onClick={() => router.push(`/library/${userId}`)}
                  style={{ width: '100%' }}
                />
              </UserActionsWrapper>
            )}

            <DividerLine style={{ margin: '1.2rem 0' }} />

            <UserStatsWrapper>
              {userStats.map((stat, index) => (
                <UserStatItemComponent key={index} {...stat} />
              ))}
            </UserStatsWrapper>
          </>
        )}
      </UserProfileContainer>

      {followListModal && userId && (
        <Dialog.Root open>
          <FollowListModal
            userId={userId}
            type={followListModal}
            onClose={() => setFollowListModal(null)}
          />
        </Dialog.Root>
      )}
    </>
  )
}
