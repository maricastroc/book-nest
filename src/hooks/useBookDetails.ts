/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import { useAppContext } from '@/contexts/AppContext'
import useRequest from './useRequest'

export function useBookDetails(
  bookId: string,
  onUpdateBook: (book: BookProps) => void,
) {
  const [updatedBook, setUpdatedBook] = useState<BookProps | null>(null)

  const [userRating, setUserRating] = useState<RatingProps | undefined>(
    undefined,
  )

  const [bookRatings, setBookRatings] = useState<RatingProps[]>([])

  const { loggedUser } = useAppContext()

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

  const updateBookWithRatings = (
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
  }

  const onCreateReview = (newRating: RatingProps) => {
    const updatedRatings = [...bookRatings, newRating]
    setBookRatings(updatedRatings)
    setUserRating(newRating)
    updateBookWithRatings(updatedRatings, newRating.rate)
  }

  const onUpdateReview = (updatedReview: RatingProps) => {
    const updatedRatings = bookRatings.map((rating) =>
      rating.id === updatedReview.id ? updatedReview : rating,
    )

    setBookRatings(updatedRatings)
    setUserRating(updatedReview)
    updateBookWithRatings(updatedRatings, updatedReview.rate)
  }

  const onDeleteReview = (ratingId: string) => {
    const updatedRatings = bookRatings.filter(
      (rating) => rating.id !== ratingId,
    )

    setBookRatings(updatedRatings)
    setUserRating(undefined)
    updateBookWithRatings(updatedRatings)
  }

  const onUpdateStatus = (
    book: BookProps,
    newStatus: string,
    userRating: number,
  ) => {
    setUpdatedBook((prevBook) => {
      if (!prevBook) return prevBook

      const updatedBook = {
        ...prevBook,
        userRating,
        ratingCount: book?.ratings?.length,
        readingStatus: newStatus,
      }

      mutate()
      onUpdateBook(updatedBook)

      return updatedBook
    })
  }

  useEffect(() => {
    if (book) {
      setUpdatedBook(book)

      if (book?.ratings) {
        setBookRatings(book?.ratings)

        const foundUserRating = book?.ratings.find(
          (rating) => rating.user.id === loggedUser?.id,
        )

        setUserRating(foundUserRating)
      }
    }
  }, [book, bookId])

  return {
    updatedBook,
    userRating,
    bookRatings,
    isValidating,
    onUpdateBook,
    onUpdateStatus,
    onUpdateReview,
    onCreateReview,
    onDeleteReview,
  }
}
