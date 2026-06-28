import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faUsers } from '@fortawesome/free-solid-svg-icons'

import { Avatar } from '@/components/ui/Avatar'
import useRequest from '@/hooks/useRequest'
import { BaseModal } from '@/components/ui/BaseModal'

interface UserItem {
  id: string
  name: string
  avatarUrl?: string | null
}

interface FollowListModalProps {
  userId: string
  type: 'followers' | 'following'
  onClose: () => void
}

export function FollowListModal({
  userId,
  type,
  onClose,
}: FollowListModalProps) {
  const router = useRouter()

  const { data, isValidating } = useRequest<UserItem[]>(
    {
      url: `/user/${type}`,
      method: 'GET',
      params: { userId },
    },
    { revalidateOnFocus: false },
  )

  const label = type === 'followers' ? 'Followers' : 'Following'
  const users = data ?? []
  const title = data ? `${label} · ${users.length}` : label

  const handleUserClick = (id: string) => {
    onClose()
    router.push(`/profile/${id}`)
  }

  return (
    <BaseModal onClose={onClose} title={title} isCompact>
      <div className="-mx-2 flex max-h-80 w-[calc(100%+1rem)] flex-col gap-0.5 overflow-y-auto">
        {isValidating ? (
          <p className="py-6 text-center text-sm text-fg3">Loading...</p>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-el text-fg3">
              <FontAwesomeIcon icon={faUsers} style={{ fontSize: 18 }} />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-[0.95rem] font-medium text-fg">
                {type === 'followers'
                  ? 'No followers yet'
                  : 'Not following anyone yet'}
              </p>
              <p className="max-w-[15rem] text-[0.8rem] leading-relaxed text-fg3">
                {type === 'followers'
                  ? 'When other readers follow this profile, they’ll show up here.'
                  : 'Follow other readers to keep up with their reviews and shelves.'}
              </p>
            </div>
          </div>
        ) : (
          users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleUserClick(user.id)}
              className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-el"
            >
              <Avatar avatarUrl={user.avatarUrl} variant="small" />
              <p className="text-[0.9rem] font-medium text-fg transition-colors group-hover:text-ac">
                {user.name}
              </p>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="ml-auto text-fg3 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ fontSize: 12 }}
              />
            </button>
          ))
        )}
      </div>
    </BaseModal>
  )
}
