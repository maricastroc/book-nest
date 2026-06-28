import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import * as Dialog from '@radix-ui/react-dialog'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useAppContext } from '@/contexts/AppContext'
import { Avatar } from '../../../../components/shared/Avatar'
import { SkeletonUserDetails } from '../SkeletonUserDetails'
import { Button } from '@/components/ui/Button'
import { UserStatistics } from '@/@types/user_statistics'
import { useFollowStatus } from '@/hooks/useFollowStatus'
import { FollowListModal } from '@/components/modals/FollowListModal'
import { StatusDonut } from '../StatusDonut'

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

const formatNumber = (value: number | undefined) =>
  value != null ? value.toLocaleString('en-US') : '–'

export function UserDetails({
  userId,
  userStatistics,
  isLoading,
}: UserDetailsProps) {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  const [followListModal, setFollowListModal] = useState<
    'followers' | 'following' | null
  >(null)

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

  const statusCounts = userStatistics?.statusCounts ?? {
    read: 0,
    reading: 0,
    wantToRead: 0,
    didNotFinish: 0,
  }

  const totalBooks = userStatistics?.booksCount ?? 0

  const metrics = [
    { value: formatNumber(userStatistics?.readPages), label: 'Pages read' },
    { value: formatNumber(userStatistics?.ratedBooks), label: 'Rated books' },
    {
      value: formatNumber(userStatistics?.authorsCount),
      label: 'Authors read',
    },
    { value: userStatistics?.bestGenre ?? '–', label: 'Top genre' },
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
      <div className="flex w-full justify-center">
        {isLoading ? (
          <SkeletonUserDetails />
        ) : (
          <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-feature border border-line bg-s1">
            {/* Header zone */}
            <div className="flex flex-col items-center px-6 pt-7 text-center">
              <Avatar avatarUrl={userAvatarUrl} variant="large" />
              <h2 className="mt-3 text-lg font-semibold text-fg">{userName}</h2>
              <time
                title={dateInfo.dateFormatted}
                dateTime={dateInfo.dateString}
                className="mt-0.5 text-[12px] text-fg3"
              >
                joined {dateInfo.dateRelativeToNow}
              </time>

              <div className="mt-4 flex items-center gap-5 text-[13px] text-fg2">
                <button
                  onClick={() => setFollowListModal('followers')}
                  className="transition-colors hover:text-ac [&>strong]:font-semibold [&>strong]:text-fg"
                >
                  <strong>{followersCount}</strong> followers
                </button>
                <span className="h-3 w-px bg-line" />
                <button
                  onClick={() => setFollowListModal('following')}
                  className="transition-colors hover:text-ac [&>strong]:font-semibold [&>strong]:text-fg"
                >
                  <strong>{followingCount}</strong> following
                </button>
              </div>

              <div className="mt-5 flex w-full flex-col gap-2">
                {isCurrentUser ? (
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
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Donut zone */}
            <div className="mt-6 border-t border-line px-6 py-6">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-fg3">
                Reading Breakdown
              </p>
              <StatusDonut statusCounts={statusCounts} total={totalBooks} />
            </div>

            {/* Metrics zone */}
            <div className="border-t border-line px-6 py-2">
              {metrics.map(({ value, label }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-line py-3 last:border-b-0"
                >
                  <span className="text-[13px] text-fg2">{label}</span>
                  <span className="text-[14px] font-semibold text-fg">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
