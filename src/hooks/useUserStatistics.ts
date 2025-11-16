import { useCallback } from 'react'
import useRequest from './useRequest'
import { UserStatistics } from '@/@types/user_statistics'

export function useUserStatistics(userId: string | undefined) {
  const requestConfig = userId
    ? {
        url: `/profile/statistics/${userId}`,
        method: 'GET',
      }
    : null

  const { data, mutate, isValidating } = useRequest<UserStatistics>(
    requestConfig,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    },
  )

  const mutateStatistics = useCallback(() => {
    if (userId) {
      mutate(undefined, { revalidate: true })
    }
  }, [mutate, userId])

  return {
    userStatistics: data,
    isValidatingStatistics: isValidating,
    mutateStatistics,
  }
}
