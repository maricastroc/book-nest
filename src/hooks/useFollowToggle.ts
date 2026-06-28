import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/axios'

/**
 * Lightweight follow toggle for list rows where the initial follow state
 * already comes from the parent request (e.g. `/user/search`). Unlike
 * `useFollowStatus`, it performs no GET request, avoiding an N+1 per row.
 */
export function useFollowToggle(
  userId: string | undefined,
  initialIsFollowing: boolean,
) {
  const { data: session } = useSession()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isTogglingFollow, setIsTogglingFollow] = useState(false)

  useEffect(() => {
    setIsFollowing(initialIsFollowing)
  }, [initialIsFollowing])

  const toggleFollow = async () => {
    if (!session?.user?.id || !userId || isTogglingFollow) return

    const next = !isFollowing
    setIsTogglingFollow(true)
    setIsFollowing(next)

    try {
      if (next) {
        await api.post('/user/follow', { followingId: userId })
      } else {
        await api.delete('/user/follow', { data: { followingId: userId } })
      }
    } catch (error) {
      setIsFollowing(!next)
      throw error
    } finally {
      setIsTogglingFollow(false)
    }
  }

  return { isFollowing, isTogglingFollow, toggleFollow }
}
