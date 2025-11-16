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
      revalidateIfStale: true, // ← IMPORTANTE: true
      dedupingInterval: 60000, // 1 minuto
      focusThrottleInterval: 300000, // 5 minutos
    },
  )

  const mutateStatistics = useCallback(() => {
    if (userId) {
      // Isso SEMPRE vai recarregar com revalidateIfStale: true
      mutate(undefined, { revalidate: true })
    }
  }, [mutate, userId])

  return {
    userStatistics: data,
    isValidatingStatistics: isValidating,
    mutateStatistics,
  }
}
