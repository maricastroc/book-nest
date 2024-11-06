/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { RatingProps } from '@/@types/rating'
import { UserProps } from '@/@types/user'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useSession } from 'next-auth/react'

export interface UserStatistics {
  ratings: RatingProps[] | undefined
  readPages: number
  booksCount: number
  authorsCount: number
  bestGenre: string | undefined
  user: UserProps
}

interface AppContextType {
  loggedUser: UserProps | null
  isLoading: boolean
  handleSetLoggedUser: (data: UserProps) => void
  handleSetIsLoading: (value: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loggedUser, setLoggedUser] = useState<UserProps | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const session = useSession()

  const handleSetIsLoading = (value: boolean) => {
    setIsLoading(value)
  }

  const handleSetLoggedUser = (value: UserProps) => {
    setLoggedUser(value)
  }

  const fetchLoggedUser = async (): Promise<UserStatistics | undefined> => {
    setIsLoading(true)

    if (session?.data?.user) {
      try {
        const response = await api.get(`/profile/${session?.data?.user.id}`)

        setLoggedUser(response.data.profile.user)

        return response.data.profile
      } catch (error) {
        handleApiError(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (session?.data?.user) {
      fetchLoggedUser()
    }
  }, [session?.data?.user])

  return (
    <AppContext.Provider
      value={{
        loggedUser,
        handleSetIsLoading,
        handleSetLoggedUser,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
