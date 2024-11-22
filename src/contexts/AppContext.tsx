/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { RatingProps } from '@/@types/rating'
import { UserProps } from '@/@types/user'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

export interface UserStatistics {
  ratings: RatingProps[] | undefined
  readPages: number
  booksCount: number
  authorsCount: number
  bestGenre: string | undefined
  user: UserProps
}

export interface EditReviewData {
  ratingId: string
  description: string
  rate: number
}

export interface CreateReviewData {
  userId: string | number
  bookId: string
  description?: string
  rate: number
}

interface AppContextType {
  loggedUser: UserProps | null
  handleSetUserId: (value: string) => void
  handleSetLoggedUser: (data: UserProps) => void
  handleEditReview: (data: EditReviewData) => Promise<RatingProps>
  handleCreateReview: (data: CreateReviewData) => Promise<RatingProps>
  handleDeleteReview: (id: string) => Promise<void>
  isValidatingLoggedUser: boolean
  userId: string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loggedUser, setLoggedUser] = useState<UserProps | null>(null)

  const [userId, setUserId] = useState('')

  const [isValidatingLoggedUser, setIsValidatingLoggedUser] = useState(false)
  useState<boolean>(false)

  const session = useSession()

  const handleSetLoggedUser = useCallback(
    (value: UserProps) => setLoggedUser(value),
    [],
  )

  const handleSetUserId = useCallback((value: string) => setUserId(value), [])

  const fetchLoggedUser = async (): Promise<UserStatistics | undefined> => {
    setIsValidatingLoggedUser(true)

    if (session?.data?.user) {
      try {
        const response = await api.get(`/profile/${session?.data?.user.id}`)
        setLoggedUser(response.data.profile.user)
        return response.data.profile
      } catch (error) {
        handleApiError(error)
      } finally {
        setIsValidatingLoggedUser(false)
      }
    }
  }

  const handleDeleteReview = async (id: string) => {
    try {
      const response = await api.delete('/ratings', { data: { id } })

      toast.success(response?.data?.message)
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleEditReview = async (data: EditReviewData) => {
    try {
      const response = await api.put('/ratings', {
        id: data.ratingId,
        description: data.description,
        rate: data.rate,
      })

      toast.success(response?.data?.message)

      return response.data.rating
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreateReview = async (data: CreateReviewData) => {
    try {
      const response = await api.post(`/ratings`, { data: { ...data } })

      toast.success(response?.data?.message)

      return response.data.rating
    } catch (error) {
      handleApiError(error)
    }
  }

  useEffect(() => {
    if (session?.data?.user) {
      fetchLoggedUser()
    }
  }, [session?.data?.user])

  const contextValue = useMemo(
    () => ({
      loggedUser,
      handleSetLoggedUser,
      isValidatingLoggedUser,
      handleCreateReview,
      handleEditReview,
      handleDeleteReview,
      handleSetUserId,
      userId,
    }),
    [loggedUser, userId],
  )

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
