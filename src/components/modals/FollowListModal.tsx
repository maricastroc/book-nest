import { useRouter } from 'next/router'

import { Avatar } from '@/components/shared/Avatar'
import useRequest from '@/hooks/useRequest'
import { styled } from '@/styles'
import { BaseModal } from '../ui/BaseModal'

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

const UserRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.6rem 0',
  borderBottom: '1px solid $gray600',
  cursor: 'pointer',
  borderRadius: 4,
  transition: 'background 150ms',

  '&:last-child': {
    borderBottom: 'none',
  },

  '&:hover p': {
    color: '$purple100',
  },

  p: {
    fontSize: '0.9rem',
    color: '$gray100',
    fontWeight: 500,
    transition: 'color 150ms',
  },
})

const EmptyMessage = styled('p', {
  fontSize: '0.875rem',
  color: '$gray400',
  textAlign: 'center',
  padding: '1rem 0',
})

const ListContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxHeight: '20rem',
  overflowY: 'auto',
})

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
      <ListContainer>
        {isValidating ? (
          <EmptyMessage>Loading...</EmptyMessage>
        ) : users.length === 0 ? (
          <EmptyMessage>No {type} yet.</EmptyMessage>
        ) : (
          users.map((user) => (
            <UserRow key={user.id} onClick={() => handleUserClick(user.id)}>
              <Avatar avatarUrl={user.avatarUrl} variant="small" />
              <p>{user.name}</p>
            </UserRow>
          ))
        )}
      </ListContainer>
    </BaseModal>
  )
}
