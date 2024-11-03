import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { UserProps } from '@/@types/user'

interface AppContextType {
  loadUser: (userId: string) => Promise<UserProps | null>
  books: BookProps[]
  categories: CategoryProps[]
  refreshBooks: () => Promise<void>
  handleSetBooks: (updatedBooks: BookProps[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [books, setBooks] = useState<BookProps[]>([])
  const [categories, setCategories] = useState<CategoryProps[]>([])

  const loadUser = async (userId: string) => {
    if (userId) {
      try {
        const response = await api.get(`/profile/${userId}`)
        if (response.data) {
          return response.data.profile.user
        }
      } catch (error) {
        handleAxiosError(error)
      }
    }
    return null
  }

  const refreshBooks = async () => {
    try {
      const response = await api.get('/books')

      const booksWithRating = response.data.booksWithRating

      setBooks(booksWithRating)
    } catch (error) {
      console.error('Error loading books:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSetBooks = (updatedBooks: BookProps[]) => {
    setBooks(updatedBooks)
  }

  useEffect(() => {
    refreshBooks()
    loadCategories()
  }, [])

  return (
    <AppContext.Provider
      value={{ loadUser, books, categories, refreshBooks, handleSetBooks }}
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
