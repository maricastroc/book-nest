/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import useRequest from '@/hooks/useRequest'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react'
import { useAppContext } from './AppContext'

type LoadingState = {
  initial: boolean
  status: boolean
  reviews: boolean
}

type BookContextType = {
  updatedBook: BookProps | null
  activeStatus: string | null | undefined
  userRating: RatingProps | null
  isValidatingBookData: boolean
  isValidatingUserRating: boolean
  loadingState: LoadingState
  bookRatings: RatingProps[]
  mutateBookData: any
  mutateUserRating: any
  onUpdateUserRating: (rating: RatingProps | null) => void
  onUpdateRating?: () => Promise<void>
  onUpdateActiveStatus: (newStatus: string) => void
  onUpdateStatus: (newStatus: string) => Promise<void>
}

const BookContext = createContext<BookContextType | undefined>(undefined)

type BookProviderProps = {
  children: React.ReactNode
  bookId: string | undefined
  onUpdateBook: (book: BookProps) => void
  onUpdateRating?: () => Promise<void>
}

export function BookProvider({
  children,
  bookId,
  onUpdateRating,
  onUpdateBook,
}: BookProviderProps) {
  const [updatedBook, setUpdatedBook] = useState<BookProps | null>(null)

  const [userRating, setUserRating] = useState<RatingProps | null>(null)

  const [bookRatings, setBookRatings] = useState<RatingProps[]>([])

  const [loadingState, setLoadingState] = useState<LoadingState>({
    initial: true,
    status: false,
    reviews: false,
  })

  const { loggedUser } = useAppContext()

  const {
    data: book,
    mutate: mutateBookData,
    isValidating: isValidatingBookData,
  } = useRequest<BookProps | null>({
    url: `/books/${bookId}`,
    method: 'GET',
  })

  const {
    data: userRatingData,
    mutate: mutateUserRating,
    isValidating: isValidatingUserRating,
  } = useRequest<RatingProps | undefined>({
    url: `/books/${bookId}/user_rating`,
    method: 'GET',
  })

  const [activeStatus, setActiveStatus] = useState<string | null | undefined>(
    book?.readingStatus || null,
  )

  const onUpdateUserRating = (rating: RatingProps | null) => {
    setUserRating(rating)
  }

  const onUpdateActiveStatus = useCallback((newStatus: string) => {
    setActiveStatus(newStatus)
  }, [])

  const onUpdateStatus = useCallback(
    async (newStatus: string) => {
      setLoadingState((prev) => ({ ...prev, status: true }))
      setActiveStatus(newStatus)

      try {
        setUpdatedBook((prevBook) => {
          if (!prevBook) return prevBook

          const updatedBook = {
            ...prevBook,
            readingStatus: newStatus,
          }

          onUpdateBook(updatedBook)
          return updatedBook
        })

        await mutateUserRating()
        await mutateBookData()
      } finally {
        setLoadingState((prev) => ({ ...prev, status: false }))
      }
    },
    [mutateBookData, onUpdateBook, mutateUserRating],
  )

  useEffect(() => {
    if (book) {
      setUpdatedBook(book)
      setActiveStatus((prev) => {
        return prev === undefined || prev === book.readingStatus
          ? book.readingStatus
          : prev
      })

      if (book?.ratings) {
        setBookRatings(book.ratings)
      }

      if (loadingState.initial) {
        setLoadingState((prev) => ({ ...prev, initial: false }))
      }
    }
  }, [book, loggedUser?.id, loadingState.initial])

  useEffect(() => {
    setUserRating(userRatingData || null)
  }, [userRatingData])

  const contextValue = useMemo(
    () => ({
      updatedBook,
      activeStatus,
      userRating,
      isValidatingBookData,
      loadingState,
      bookRatings,
      isValidatingUserRating,
      onUpdateUserRating,
      onUpdateRating,
      mutateBookData,
      mutateUserRating,
      onUpdateActiveStatus,
      onUpdateStatus,
    }),
    [
      updatedBook,
      activeStatus,
      userRating,
      isValidatingBookData,
      loadingState,
      bookRatings,
      isValidatingUserRating,
      onUpdateUserRating,
      mutateBookData,
      mutateUserRating,
      onUpdateActiveStatus,
      onUpdateStatus,
    ],
  )

  return (
    <BookContext.Provider value={contextValue}>{children}</BookContext.Provider>
  )
}

export function useBookContext() {
  const context = useContext(BookContext)
  if (context === undefined) {
    throw new Error('useBookContext must be used within a BookProvider')
  }
  return context
}
