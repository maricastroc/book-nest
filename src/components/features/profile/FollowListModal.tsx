import { useRouter } from 'next/router'

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

  const title = type === 'followers' ? 'Followers' : 'Following'
  const users = data ?? []

  const handleUserClick = (id: string) => {
    onClose()
    router.push(`/profile/${id}`)
  }

  return (
    <BaseModal onClose={onClose} title={title}>
      <div className="flex max-h-80 w-full flex-col overflow-y-auto">
        {isValidating ? (
          <p className="py-4 text-center text-sm text-fg3">Loading...</p>
        ) : users.length === 0 ? (
          <p className="py-4 text-center text-sm text-fg3">No {type} yet.</p>
        ) : (
          users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleUserClick(user.id)}
              className="group flex items-center gap-3 rounded border-b border-line py-[0.6rem] transition-colors last:border-none"
            >
              <Avatar avatarUrl={user.avatarUrl} variant="small" />
              <p className="text-[0.9rem] font-medium text-fg transition-colors group-hover:text-ac">
                {user.name}
              </p>
            </button>
          ))
        )}
      </div>
    </BaseModal>
  )
}
