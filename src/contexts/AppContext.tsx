import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { UserProps } from '@/@types/user'
import { RatingProps } from '@/@types/rating'

interface AppContextType {
  loadUser: (userId: string) => Promise<UserProps | null>
  books: BookProps[]
  popularBooks: BookProps[]
  latestRatings: RatingProps[]
  categories: CategoryProps[]
  userLatestRating: RatingProps | undefined
  refreshBooks: () => Promise<void>
  refreshPopularBooks: () => Promise<void>
  refreshLatestRatings: () => Promise<void>
  refreshUserLatestRatings: () => Promise<void>
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

  const [isLoading, setIsLoading] = useState(false)

  const loadUser = async (userId: string) => {
    if (userId) {
      setIsLoading(true)

      try {
        const response = await api.get(`/profile/${userId}`)
        if (response.data) {
          return response.data.profile.user
        }
      } catch (error) {
        handleAxiosError(error)
      } finally {
        setIsLoading(false)
      }
    }
    return null
  }

  const refreshBooks = async () => {
    setIsLoading(true)

    try {
      const response = await api.get('/books')

      const booksWithRating = response.data.booksWithRating

      setBooks(booksWithRating)
    } catch (error) {
      console.error('Error loading books:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPopularBooks = async () => {
    setIsLoading(true)

    try {
      const response = await api.get('/books/popular')

      if (response.data) {
        setPopularBooks(response.data.books)
      }
    } catch (error) {
      console.error('Error loading books:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUserLatestRatings = async () => {
    setIsLoading(true)

    try {
      const response = await api.get('/ratings/user_latest')

      if (response.data) {
        setUserLatestRating(response.data.rating)
      }
    } catch (error) {
      console.error('Error loading books:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    setIsLoading(true)

    try {
      const response = await api.get('/categories')
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetBooks = (updatedBooks: BookProps[]) => {
    setBooks(updatedBooks)
  }

  const refreshLatestRatings = async () => {
    setIsLoading(true)

    try {
      const response = await api.get('/ratings/latest')
      setLatestRatings(response.data.ratings)
    } catch (error) {
      console.error('Error loading latest ratings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshBooks()
    loadCategories()
    refreshLatestRatings()
    refreshPopularBooks()
    refreshUserLatestRatings()
  }, [])

  return (
    <AppContext.Provider
      value={{
        isLoading,
        loadUser,
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
