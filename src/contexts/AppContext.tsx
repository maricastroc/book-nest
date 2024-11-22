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

interface AppContextType {
  loggedUser: UserProps | null
  handleSetUserId: (value: string) => void
  handleSetLoggedUser: (data: UserProps) => void
  books: BookProps[] | undefined | null
  users: UserProps[] | undefined | null
  popularBooks: BookProps[] | null | undefined
  latestRatings: RatingProps[] | undefined
  categories: CategoryProps[] | null | undefined
  handleSelectReadingStatus: (book: BookProps, status: string) => Promise<void>
  handleEditReview: (data: EditReviewData) => Promise<RatingProps>
  handleCreateReview: (data: CreateReviewData) => Promise<RatingProps>
  handleDeleteReview: (id: string) => Promise<void>
  handleSetSearch: (value: string) => void
  handleSetSelectedCategory: (value: string | null) => void
  handleFetchUserStatistics: (
    userId: string | undefined,
    search: string | undefined,
  ) => Promise<UserStatistics | undefined>
  userLatestRatingData: RatingProps | null | undefined
  isValidatingHomePage: boolean
  isValidatingExplorePage: boolean
  isValidatingUserStatistics: boolean
  isValidatingUserLatestReading: boolean
  isValidatingUsers: boolean
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

  const [isValidatingUserStatistics, setIsValidatingUserStatistics] =
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

  const { data: users, isValidating: isValidatingUsers } = useRequest<
    UserProps[]
  >({
    url: '/user/search',
    method: 'GET',
    params: {
      search,
    },
  })

  const { data: popularBooks, isValidating: isValidatingPopularBooks } =
    useRequest<BookProps[]>({
      url: '/books/popular',
      method: 'GET',
    })

  const { data: latestRatings, isValidating: isValidatingLatestRatings } =
    useRequest<RatingProps[]>({
      url: '/ratings/latest',
      method: 'GET',
    })

  const { data: books, isValidating: isValidatingBooks } = useRequest<
    BookProps[] | null
  >({
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
      const response = await api.delete('/ratings', { data: { id } })

      toast.success(response?.data?.message)

      const updates = []

      if (router.pathname === '/home') {
        updates.push(mutateUserLatestRating())
      }

      await Promise.all(updates)
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

      const updates = []

      if (router.pathname === '/home') {
        updates.push(mutateUserLatestRating())
      }

      return response.data.rating
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreateReview = async (data: CreateReviewData) => {
    try {
      const response = await api.post(`/ratings`, { data: { ...data } })

      toast.success(response?.data?.message)

      const updates = []

      if (router.pathname === '/home') {
        updates.push(mutateUserLatestRating())
      }

      return response.data.rating
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
      } catch (error) {
        handleApiError(error)
      }
    }
  }

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

  useEffect(() => {
    if (session?.data?.user) {
      fetchLoggedUser()
    }
  }, [session?.data?.user])

  const isValidating =
    isValidatingLatestRatings ||
    isValidatingPopularBooks ||
    isValidatingUserLatestReading ||
    isValidatingBooks

  const isValidatingHomePage =
    isValidatingPopularBooks ||
    isValidatingLatestRatings ||
    isValidatingUserLatestReading

  const isValidatingExplorePage = isValidatingBooks

  const contextValue = useMemo(
    () => ({
      loggedUser,
      search,
      selectedCategory,
      handleSetLoggedUser,
      books,
      users,
      categories,
      popularBooks,
      latestRatings,
      userLatestRatingData,
      isValidating,
      isValidatingHomePage,
      isValidatingExplorePage,
      isValidatingUserStatistics,
      isValidatingLoggedUser,
      isValidatingUsers,
      handleSelectReadingStatus,
      handleCreateReview,
      handleEditReview,
      handleDeleteReview,
      handleSetSearch,
      handleSetSelectedCategory,
      handleSetUserId,
      handleFetchUserStatistics,
      isValidatingUserLatestReading,
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
