/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useAppContext } from '@/contexts/AppContext'

export function useBookDetails(
  bookId: string,
  onUpdateBook: (book: BookProps) => void,
) {
  const [book, setBook] = useState<BookProps | null>(null)
  const [userRating, setUserRating] = useState<RatingProps | undefined>(
    undefined,
  )
  const [bookRatings, setBookRatings] = useState<RatingProps[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { loggedUser } = useAppContext()

  const fetchBookInfo = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/books/${bookId}`)
      const bookData: BookProps = response.data.book

      if (bookData?.ratings) {
        setBook(bookData)
        setBookRatings(bookData.ratings)

        const foundUserRating = bookData.ratings.find(
          (rating) => rating.user.id === loggedUser?.id,
        )
        setUserRating(foundUserRating)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

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

    setBook((prev) => {
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
    setBook((prevBook) => {
      if (!prevBook) return prevBook

      const updatedBook = {
        ...prevBook,
        userRating,
        ratingCount: book?.ratings?.length,
        readingStatus: newStatus,
      }

      onUpdateBook(updatedBook)
      return updatedBook
    })
  }

  useEffect(() => {
    if (bookId) {
      fetchBookInfo()
    }
  }, [bookId])

  return {
    book,
    userRating,
    bookRatings,
    isLoading,
    onUpdateBook,
    onUpdateStatus,
    onUpdateReview,
    onCreateReview,
    onDeleteReview,
    refetch: fetchBookInfo,
  }
}
