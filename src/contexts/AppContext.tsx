/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import { useSession } from 'next-auth/react'
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
  books: BookProps[]
  popularBooks: BookProps[]
  latestRatings: RatingProps[]
  categories: CategoryProps[]
  userLatestRating: RatingProps | undefined
  refreshBooks: () => Promise<void>
  refreshPopularBooks: () => Promise<void>
  refreshLatestRatings: () => Promise<void>
  refreshUserLatestRatings: () => Promise<void>
  fetchUserStatistics: (
    userId: string,
    search?: string,
  ) => Promise<UserStatistics | undefined>
  handleSetBooks: (updatedBooks: BookProps[]) => void
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [books, setBooks] = useState<BookProps[]>([])

  const [categories, setCategories] = useState<CategoryProps[]>([])

  const [latestRatings, setLatestRatings] = useState<RatingProps[]>([])

  const [popularBooks, setPopularBooks] = useState<BookProps[]>([])

  const [userLatestRating, setUserLatestRating] = useState<RatingProps>()

  const [loggedUser, setLoggedUser] = useState<UserProps | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const session = useSession()

  const fetchData = async <T,>(
    apiCall: () => Promise<T>,
    setter: React.Dispatch<React.SetStateAction<T>>,
  ) => {
    setIsLoading(true)
    try {
      const response = await apiCall()
      setter(response)
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshBooks = () =>
    fetchData(
      () => api.get('/books').then((res) => res.data.booksWithRating),
      setBooks,
    )

  const refreshPopularBooks = () =>
    fetchData(
      () => api.get('/books/popular').then((res) => res.data.books),
      setPopularBooks,
    )

  const refreshUserLatestRatings = () => {
    if (!session?.data?.user) return Promise.resolve()
    return fetchData(
      () => api.get('/ratings/user_latest').then((res) => res.data.rating),
      setUserLatestRating,
    )
  }

  const loadCategories = () =>
    fetchData(
      () => api.get('/categories').then((res) => res.data.categories),
      setCategories,
    )

  const refreshLatestRatings = () =>
    fetchData(
      () => api.get('/ratings/latest').then((res) => res.data.ratings),
      setLatestRatings,
    )

  const fetchUserStatistics = async (
    userId: string,
    search?: string,
  ): Promise<UserStatistics | undefined> => {
    setIsLoading(true)
    try {
      const response = await api.get(`/profile/${userId}`, {
        params: { search },
      })

      if (session?.data?.user.id === userId) {
        setLoggedUser(response.data.profile.user)
      }

      return response.data.profile
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLoggedUser = async (): Promise<UserStatistics | undefined> => {
    setIsLoading(true)

    if (session?.data?.user) {
      try {
        const response = await api.get(`/profile/${session?.data?.user.id}`)

        setLoggedUser(response.data.profile.user)

        return response.data.profile
      } catch (error) {
        handleAxiosError(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSetBooks = (updatedBooks: BookProps[]) => setBooks(updatedBooks)

  useEffect(() => {
    refreshBooks()
    loadCategories()
    refreshLatestRatings()
    refreshPopularBooks()
  }, [])

  useEffect(() => {
    if (session?.data?.user) {
      refreshUserLatestRatings()
      fetchLoggedUser()
    }
  }, [session?.data?.user])

  return (
    <AppContext.Provider
      value={{
        loggedUser,
        isLoading,
        books,
        categories,
        refreshBooks,
        handleSetBooks,
        latestRatings,
        popularBooks,
        userLatestRating,
        refreshPopularBooks,
        refreshLatestRatings,
        refreshUserLatestRatings,
        fetchUserStatistics,
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
