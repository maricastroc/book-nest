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
import { useRatings } from './RatingsContext'
import { KeyedMutator } from 'swr'

type BookData = {
  book: BookProps | null | undefined
  ratings: RatingProps[]
  isValidating: boolean
  mutate: KeyedMutator<any>
}

type UserRatingData = {
  rating: RatingProps | null
  isValidating: boolean
  mutate: KeyedMutator<any>
}

type StatusData = {
  active: string | null | undefined
  isUpdating: boolean
  update: (newStatus: string) => Promise<void>
}

type BookActions = {
  updateUserRating: (rating: RatingProps | null) => void
  updateBookRatings: (ratings: RatingProps[]) => void
  updateRating?: () => Promise<void>
}

type BookContextType = {
  bookData: BookData
  userRating: UserRatingData
  status: StatusData
  actions: BookActions
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
  onUpdateBook,
  onUpdateRating,
}: BookProviderProps) {
  const bookRequest = bookId ? { url: `/books/${bookId}`, method: 'GET' } : null

  const userRequest = bookId
    ? { url: `/books/${bookId}/user_rating`, method: 'GET' }
    : null

  const {
    data: book,
    mutate: mutateBookData,
    isValidating: isValidatingBookData,
  } = useRequest<BookProps | null>(bookRequest)

  const {
    data: userRatingData,
    mutate: mutateUserRating,
    isValidating: isValidatingUserRating,
  } = useRequest<RatingProps | undefined>(userRequest)

  const [isStatusUpdating, setIsStatusUpdating] = useState(false)

  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null)

  const [userRating, setUserRating] = useState<RatingProps | null>(null)

  const { registerRatingGroup } = useRatings()

  useEffect(() => {
    setUserRating(userRatingData || null)
  }, [userRatingData])

  const updateStatus = useCallback(
    async (newStatus: string) => {
      setIsStatusUpdating(true)
      setOptimisticStatus(newStatus)

      try {
        if (book) {
          const updatedBook = { ...book, readingStatus: newStatus }
          onUpdateBook(updatedBook)
          await mutateUserRating()
          await mutateBookData()
        }
      } finally {
        setIsStatusUpdating(false)
      }
    },
    [book, mutateBookData, onUpdateBook, mutateUserRating],
  )

  const updateBookRatings = useCallback(
    (ratings: RatingProps[]) => {
      if (ratings) registerRatingGroup('lateralMenu', ratings)
    },
    [registerRatingGroup],
  )

  const handleUpdateUserRating = useCallback((rating: RatingProps | null) => {
    setUserRating(rating)
  }, [])

  const currentStatus = optimisticStatus || book?.readingStatus || null

  const contextValue: BookContextType = useMemo(
    () => ({
      bookData: {
        book:
          optimisticStatus && book
            ? { ...book, readingStatus: optimisticStatus }
            : book,
        ratings: book?.ratings || [],
        isValidating: isValidatingBookData,
        mutate: mutateBookData,
      },
      userRating: {
        rating: userRating,
        isValidating: isValidatingUserRating,
        mutate: mutateUserRating,
      },
      status: {
        active: currentStatus,
        isUpdating: isStatusUpdating,
        update: updateStatus,
      },
      actions: {
        updateUserRating: handleUpdateUserRating,
        updateBookRatings,
        updateRating: onUpdateRating,
      },
    }),
    [
      book,
      currentStatus,
      userRating,
      isValidatingBookData,
      isValidatingUserRating,
      isStatusUpdating,
      updateStatus,
      updateBookRatings,
      onUpdateRating,
      mutateBookData,
      mutateUserRating,
      handleUpdateUserRating,
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
