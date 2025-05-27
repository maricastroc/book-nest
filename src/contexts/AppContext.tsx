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
import toast from 'react-hot-toast'
import useRequest from '@/hooks/useRequest'

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
  isValidatingReview: boolean
  loggedUser: UserProps | null
  handleSetIsValidatingReview: (value: boolean) => void
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

  const [isValidatingReview, setIsValidatingReview] = useState(false)

  const [userId, setUserId] = useState('')

  const session = useSession()

  const { data: user, isValidating: isValidatingLoggedUser } =
    useRequest<UserProps | null>({
      url: '/user',
      method: 'GET',
    })

  const handleSetIsValidatingReview = (value: boolean) => {
    setIsValidatingReview(value)
  }

  const handleSetLoggedUser = (user: UserProps) => {
    setLoggedUser(user)
  }

  const handleSetUserId = useCallback((value: string) => setUserId(value), [])

  const handleDeleteReview = async (id: string) => {
    try {
      setIsValidatingReview(true)

      const response = await api.delete('/ratings', { data: { id } })

      toast.success(response?.data?.message)
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsValidatingReview(false)
    }
  }

  const handleEditReview = async (data: EditReviewData) => {
    try {
      setIsValidatingReview(true)

      const response = await api.put('/ratings', {
        id: data.ratingId,
        description: data.description,
        rate: data.rate,
      })

      toast.success(response?.data?.message)

      return response.data.rating
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsValidatingReview(false)
    }
  }

  const handleCreateReview = async (data: CreateReviewData) => {
    try {
      setIsValidatingReview(true)

      const response = await api.post(`/ratings`, { data: { ...data } })

      toast.success(response?.data?.message)

      return response.data.rating
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsValidatingReview(false)
    }
  }

  useEffect(() => {
    if (session?.data?.user && user) {
      setLoggedUser(user)
    }
  }, [session?.data?.user, user])

  const contextValue = useMemo(
    () => ({
      loggedUser,
      isValidatingLoggedUser,
      isValidatingReview,
      handleSetIsValidatingReview,
      handleSetLoggedUser,
      handleCreateReview,
      handleEditReview,
      handleDeleteReview,
      handleSetUserId,
      userId,
    }),
    [loggedUser, userId, isValidatingReview],
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
