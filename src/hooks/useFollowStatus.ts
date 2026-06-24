import { api } from '@/lib/axios'
import useRequest from './useRequest'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface FollowStatus {
  followersCount: number
  followingCount: number
  isFollowing: boolean
}

export function useFollowStatus(userId: string | undefined) {
  const { data: session } = useSession()
  const [isTogglingFollow, setIsTogglingFollow] = useState(false)

  const { data, mutate, isValidating } = useRequest<FollowStatus>(
    userId
      ? {
          url: '/user/follow_status',
          method: 'GET',
          params: { userId },
        }
      : null,
    { revalidateOnFocus: false },
  )

  const toggleFollow = async () => {
    if (!session?.user?.id || !userId || isTogglingFollow) return

    const currentlyFollowing = data?.isFollowing ?? false
    setIsTogglingFollow(true)

    try {
      if (currentlyFollowing) {
        await api.delete('/user/follow', { data: { followingId: userId } })
      } else {
        await api.post('/user/follow', { followingId: userId })
      }
      await mutate()
    } finally {
      setIsTogglingFollow(false)
    }
  }

  return {
    followersCount: data?.followersCount ?? 0,
    followingCount: data?.followingCount ?? 0,
    isFollowing: data?.isFollowing ?? false,
    isValidating,
    isTogglingFollow,
    toggleFollow,
  }
}
