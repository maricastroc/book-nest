/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState } from 'react'
import { RatingProps } from '@/@types/rating'
import { UserProps } from '@/@types/user'

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

  const handleSetIsLoading = (value: boolean) => {
    setIsLoading(value)
  }

  const handleSetLoggedUser = (value: UserProps) => {
    setLoggedUser(value)
  }

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
