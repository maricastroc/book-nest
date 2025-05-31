/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import { useAppContext } from '@/contexts/AppContext'
import useRequest from './useRequest'

export function useBookDetails(
  bookId: string,
  onUpdateBook: (book: BookProps) => void,
  mutateUserLatestRating?: () => Promise<void>,
) {
  const [updatedBook, setUpdatedBook] = useState<BookProps | null>(null)

  const [userRating, setUserRating] = useState<RatingProps | undefined>(
    undefined,
  )

  const [bookRatings, setBookRatings] = useState<RatingProps[]>([])

  const [loadingState, setLoadingState] = useState<{
    initial: boolean
    status: boolean
    reviews: boolean
  }>({
    initial: true,
    status: false,
    reviews: false,
  })

  const { loggedUser } = useAppContext()

  const sortRatings = (ratings: RatingProps[], userId: string | undefined) => {
    if (!userId) return ratings
    return [
      ...ratings.filter((r) => r.user.id === userId),
      ...ratings.filter((r) => r.user.id !== userId),
    ]
  }

  const {
    data: book,
    mutate,
    isValidating,
  } = useRequest<BookProps | null>({
    url: `/books/${bookId}`,
    method: 'GET',
  })

  const calculateAverageRating = (ratings: RatingProps[]) => {
    const ratingCount = ratings.length
    const average =
      ratingCount > 0
        ? ratings.reduce((acc, r) => acc + r.rate, 0) / ratingCount
        : 0
    return { average, ratingCount }
  }

  const updateBookWithRatings = async (
    updatedRatings: RatingProps[],
    currentUserRating?: number,
  ) => {
    const { average, ratingCount } = calculateAverageRating(updatedRatings)

    setUpdatedBook((prev) => {
      if (!prev) return prev

      const updatedBook = {
        ...prev,
        ratings: updatedRatings,
        rate: average,
        ratingCount,
        userRating: currentUserRating,
      }

      onUpdateBook(updatedBook)
      return updatedBook
    })

    await mutateUserLatestRating?.()
  }

  const onCreateReview = async (newRating: RatingProps) => {
    setLoadingState((prev) => ({ ...prev, reviews: true }))

    try {
      const updatedRatings = sortRatings(
        [...bookRatings, newRating],
        loggedUser?.id as string,
      )
      setBookRatings(updatedRatings)
      setUserRating(newRating)
      updateBookWithRatings(updatedRatings, newRating.rate)
    } finally {
      setLoadingState((prev) => ({ ...prev, reviews: false }))
    }
  }

  const onUpdateReview = async (updatedReview: RatingProps) => {
    setLoadingState((prev) => ({ ...prev, reviews: true }))

    try {
      const updatedRatings = sortRatings(
        bookRatings.map((rating) =>
          rating.id === updatedReview.id ? updatedReview : rating,
        ),
        loggedUser?.id as string,
      )

      setBookRatings(updatedRatings)
      setUserRating(updatedReview)
      await updateBookWithRatings(updatedRatings, updatedReview.rate)
    } finally {
      setLoadingState((prev) => ({ ...prev, reviews: false }))
    }
  }

  const onDeleteReview = async (ratingId: string) => {
    setLoadingState((prev) => ({ ...prev, reviews: true }))

    try {
      const updatedRatings = bookRatings.filter(
        (rating) => rating.id !== ratingId,
      )
      await mutateUserLatestRating?.()
      setBookRatings(updatedRatings)
      setUserRating(undefined)
      updateBookWithRatings(updatedRatings)
    } finally {
      setLoadingState((prev) => ({ ...prev, reviews: false }))
    }
  }

  const onUpdateStatus = (newStatus: string) => {
    setLoadingState((prev) => ({ ...prev, status: true }))

    try {
      setUpdatedBook((prevBook) => {
        if (!prevBook) return prevBook

        const updatedBook = {
          ...prevBook,
          readingStatus: newStatus,
        }

        mutate()
        mutateUserLatestRating?.()
        onUpdateBook(updatedBook)

        return updatedBook
      })
    } finally {
      setLoadingState((prev) => ({ ...prev, status: false }))
    }
  }

  useEffect(() => {
    if (book) {
      setUpdatedBook(book)

      if (book?.ratings) {
        setBookRatings(book.ratings)
        setUserRating(book.ratings.find((r) => r.user.id === loggedUser?.id))
      }

      if (loadingState.initial) {
        setLoadingState((prev) => ({ ...prev, initial: false }))
      }
    }
  }, [book, bookId])

  return {
    updatedBook,
    userRating,
    bookRatings,
    isValidating,
    loadingState,
    onUpdateBook,
    onUpdateStatus,
    onUpdateReview,
    onCreateReview,
    onDeleteReview,
  }
}
