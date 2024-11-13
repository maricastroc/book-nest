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
import useRequest from '@/utils/useRequest'
import { BookProps } from '@/@types/book'
import { toast } from 'react-toastify'
import { CategoryProps } from '@/@types/category'
import { BooksStatusProps } from '@/@types/books-status'
import useDebounce from '@/utils/useDebounce' // Assumindo um hook de debounce
import { useRouter } from 'next/router'

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
  userId: string
  bookId: string
  description?: string
  rate: number
}

export interface BooksByStatusResponse {
  userInfo: { avatarUrl: string; name: string; id: string }
  booksByStatus: BooksStatusProps
}

interface AppContextType {
  loggedUser: UserProps | null
  handleSetUserId: (value: string) => void
  handleSetLoggedUser: (data: UserProps) => void
  books: BookProps[] | undefined | null
  popularBooks: BookProps[] | null | undefined
  latestRatings: RatingProps[] | undefined
  categories: CategoryProps[] | null | undefined
  handleSelectReadingStatus: (book: BookProps, status: string) => Promise<void>
  handleEditReview: (data: EditReviewData) => Promise<void>
  handleCreateReview: (data: CreateReviewData) => Promise<void>
  handleDeleteReview: (id: string) => Promise<void>
  handleSetSearch: (value: string) => void
  handleSetSelectedCategory: (value: string | null) => void
  handleFetchBooksByStatus: (
    userId: string | undefined,
  ) => Promise<BooksByStatusResponse | undefined>
  handleFetchUserStatistics: (
    userId: string | undefined,
    search: string | undefined,
  ) => Promise<UserStatistics | undefined>
  handleFetchUserSubmittedBooks: (
    userId: string | undefined,
  ) => Promise<BookProps[] | undefined>
  userLatestRatingData: RatingProps | null | undefined
  isValidatingHomePage: boolean
  isValidatingExplorePage: boolean
  isValidatingLibraryPage: boolean
  isValidatingUserStatistics: boolean
  isValidatingLoggedUser: boolean
  isValidating: boolean
  search: string
  selectedCategory: string | null
  userId: string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter()

  const [loggedUser, setLoggedUser] = useState<UserProps | null>(null)

  const [userId, setUserId] = useState('')

  const [search, setSearch] = useState('')

  const [selectedCategory, setSelectedCategory] = useState<string | null>('')

  const [isValidatingLoggedUser, setIsValidatingLoggedUser] = useState(false)
  useState<boolean>(false)

  const [isValidatingBooksStatus, setIsValidatingBooksStatus] =
    useState<boolean>(false)

  const [isValidatingUserStatistics, setIsValidatingUserStatistics] =
    useState<boolean>(false)

  const [isValidatingUserSubmittedBooks, setIsValidatingUserSubmittedBooks] =
    useState<boolean>(false)

  const session = useSession()

  const debouncedSearch = useDebounce(search, 300)

  const debouncedCategory = useDebounce(selectedCategory, 300)

  const handleSetLoggedUser = useCallback(
    (value: UserProps) => setLoggedUser(value),
    [],
  )

  const handleSetSearch = useCallback((value: string) => setSearch(value), [])

  const handleSetSelectedCategory = useCallback(
    (value: string | null) => setSelectedCategory(value),
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

  const {
    data: popularBooks,
    isValidating: isValidatingPopularBooks,
    mutate: mutatePopularBooks,
  } = useRequest<BookProps[]>({
    url: '/books/popular',
    method: 'GET',
  })

  const {
    data: latestRatings,
    isValidating: isValidatingLatestRatings,
    mutate: mutateLatestRatings,
  } = useRequest<RatingProps[]>({
    url: '/ratings/latest',
    method: 'GET',
  })

  const {
    data: books,
    mutate: mutateBooks,
    isValidating: isValidatingBooks,
  } = useRequest<BookProps[] | null>({
    url: '/books',
    method: 'GET',
    params: {
      category: debouncedCategory,
      ...(debouncedSearch?.length ? { search: debouncedSearch } : {}),
    },
  })

  const { data: categories } = useRequest<CategoryProps[] | null>({
    url: '/categories',
    method: 'GET',
  })

  const {
    data: userLatestRatingData,
    mutate: mutateUserLatestRating,
    isValidating: isValidatingUserLatestReading,
  } = useRequest<RatingProps | null>({
    url: '/ratings/user_latest',
    method: 'GET',
    params: { userId: loggedUser?.id },
  })

  const handleDeleteReview = async (id: string) => {
    try {
      await api.delete('/ratings', { data: { id } })

      toast.success('Rating successfully deleted!')

      const updates = []

      if (router.pathname === '/home') {
        updates.push(
          mutateUserLatestRating(),
          mutateLatestRatings(),
          mutatePopularBooks(),
        )
      }

      if (router.pathname === '/explore') {
        updates.push(mutateBooks())
      }

      if (router.pathname.includes('library')) {
        updates.push(
          userId && handleFetchBooksByStatus(userId),
          userId && handleFetchUserSubmittedBooks(userId),
        )
      }

      await Promise.all(updates)
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleEditReview = async (data: EditReviewData) => {
    try {
      await api.put('/ratings', {
        id: data.ratingId,
        description: data.description,
        rate: data.rate,
      })

      toast.success('Rating successfully edited!')

      const updates = []

      if (router.pathname === '/home') {
        updates.push(
          mutateUserLatestRating(),
          mutateLatestRatings(),
          mutatePopularBooks(),
        )
      }

      if (router.pathname === '/explore') {
        updates.push(mutateBooks())
      }

      if (router.pathname.includes('library')) {
        updates.push(
          userId && handleFetchUserSubmittedBooks(userId),
          userId && handleFetchBooksByStatus(userId),
        )
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreateReview = async (data: CreateReviewData) => {
    try {
      await api.post(`/ratings`, { data: { ...data } })

      toast.success('Rating successfully submitted!')

      const updates = []

      if (router.pathname === '/home') {
        updates.push(
          mutateUserLatestRating(),
          mutateLatestRatings(),
          mutatePopularBooks(),
        )
      }

      if (router.pathname === '/explore') {
        updates.push(mutateBooks())
      }

      if (router.pathname.includes('library')) {
        updates.push(
          userId && handleFetchUserSubmittedBooks(userId),
          userId && handleFetchBooksByStatus(userId),
        )
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleSelectReadingStatus = async (book: BookProps, status: string) => {
    if (loggedUser && book) {
      try {
        await api.post('/reading_status', {
          userId: loggedUser.id,
          bookId: book.id,
          status,
        })

        toast.success('Status successfully updated!')

        const updates = []

        if (router.pathname === '/home') {
          updates.push(
            mutateUserLatestRating(),
            mutateLatestRatings(),
            mutatePopularBooks(),
          )
        }

        if (router.pathname === '/explore') {
          updates.push(mutateBooks())
        }

        if (router.pathname.includes('library')) {
          updates.push(
            userId && handleFetchUserSubmittedBooks(userId),
            userId && handleFetchBooksByStatus(userId),
          )
        }

        await Promise.all(updates)
      } catch (error) {
        handleApiError(error)
      }
    }
  }

  const handleFetchBooksByStatus = useCallback(
    async (userId: string | undefined) => {
      try {
        setIsValidatingBooksStatus(true)

        const response = await api.get('/library', { params: { userId } })

        const formattedResponse = {
          booksByStatus: response.data.booksByStatus,
          userInfo: response.data.user,
        }

        return formattedResponse
      } catch (error) {
        handleApiError(error)
      } finally {
        setIsValidatingBooksStatus(false)
      }
    },
    [],
  )

  const handleFetchUserStatistics = async (
    userId: string | undefined,
    search: string | undefined,
  ) => {
    try {
      setIsValidatingUserStatistics(true)

      const response = await api.get(`/profile/${userId}`, {
        params: { search },
      })
      return response.data.profile
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsValidatingUserStatistics(false)
    }
  }

  const handleFetchUserSubmittedBooks = async (userId: string | undefined) => {
    try {
      setIsValidatingUserSubmittedBooks(true)

      const response = await api.get(`/profile/books/${userId}`)

      return response.data.books
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsValidatingUserSubmittedBooks(false)
    }
  }

  useEffect(() => {
    if (session?.data?.user) {
      fetchLoggedUser()
    }
  }, [session?.data?.user])

  const isValidating =
    isValidatingLatestRatings ||
    isValidatingPopularBooks ||
    isValidatingUserLatestReading ||
    isValidatingUserSubmittedBooks ||
    isValidatingBooks ||
    isValidatingBooksStatus

  const isValidatingHomePage =
    isValidatingPopularBooks ||
    isValidatingLatestRatings ||
    isValidatingUserLatestReading

  const isValidatingExplorePage = isValidatingBooks

  const isValidatingLibraryPage =
    isValidatingBooksStatus || isValidatingUserSubmittedBooks

  const contextValue = useMemo(
    () => ({
      loggedUser,
      search,
      selectedCategory,
      handleSetLoggedUser,
      books,
      categories,
      popularBooks,
      latestRatings,
      userLatestRatingData,
      isValidating,
      isValidatingHomePage,
      isValidatingLibraryPage,
      isValidatingExplorePage,
      isValidatingUserStatistics,
      isValidatingLoggedUser,
      handleSelectReadingStatus,
      handleCreateReview,
      handleEditReview,
      handleDeleteReview,
      handleSetSearch,
      handleSetSelectedCategory,
      handleFetchBooksByStatus,
      handleSetUserId,
      handleFetchUserStatistics,
      handleFetchUserSubmittedBooks,
      userId,
    }),
    [
      loggedUser,
      search,
      selectedCategory,
      books,
      categories,
      popularBooks,
      latestRatings,
      userLatestRatingData,
      isValidating,
      userId,
    ],
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
