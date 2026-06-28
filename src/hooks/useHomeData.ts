/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import useRequest from '@/hooks/useRequest'
import { useAppContext } from '@/contexts/AppContext'

export function useHomeData() {
  const session = useSession()
  const { isValidatingReview } = useAppContext()

  const userId = session?.data?.user?.id
    ? String(session.data.user.id)
    : undefined
  const isGuest = session.status === 'unauthenticated'
  const firstName = session?.data?.user?.name?.split(' ')[0] ?? 'Reader'

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)
  const [popularBooks, setPopularBooks] = useState<BookProps[]>([])

  const { data: popularData, mutate: mutatePopularBooks } = useRequest<
    BookProps[]
  >(
    { url: '/books/popular', method: 'GET' },
    { keepPreviousData: true, revalidateOnFocus: false },
  )

  const { data: latestRatings, error: latestRatingsError } = useRequest<
    RatingProps[]
  >(
    { url: '/ratings/latest', method: 'GET' },
    { revalidateOnFocus: false, keepPreviousData: true },
  )

  const { data: recommendedData, isValidating: isValidatingRecommended } =
    useRequest<{ books: BookProps[]; hasEnoughData: boolean }>(
      userId ? { url: '/books/recommended', method: 'GET' } : null,
      { revalidateOnFocus: false, keepPreviousData: true },
    )

  const {
    data: userLatestRating,
    mutate: mutateUserLatestRating,
    isValidating: isValidatingUserLatestRating,
    error: userLatestRatingError,
  } = useRequest<RatingProps | null>(
    userId
      ? { url: '/ratings/user_latest', method: 'GET', params: { userId } }
      : null,
    { revalidateOnFocus: false, keepPreviousData: true },
  )

  const { data: featuredData, isValidating: isValidatingFeatured } =
    useRequest<RatingProps | null>(
      isGuest ? { url: '/books/featured', method: 'GET' } : null,
      { revalidateOnFocus: false, keepPreviousData: true },
    )

  const { data: trendingBooks } = useRequest<BookProps[]>(
    isGuest ? { url: '/books/trending', method: 'GET' } : null,
    { revalidateOnFocus: false, keepPreviousData: true },
  )

  useEffect(() => {
    if (popularData) setPopularBooks(popularData)
  }, [popularData])

  const openBook = (book: BookProps) => {
    setSelectedBook(book)
    setIsLateralMenuOpen(true)
  }

  const onUpdatePopularBook = (updated: BookProps) => {
    setPopularBooks((prev) =>
      prev.map((book) => (book.id === updated.id ? updated : book)),
    )
  }

  const onUpdateRating = async () => {
    await mutateUserLatestRating()
    await mutatePopularBooks()
  }

  return {
    userId,
    isGuest,
    firstName,

    selectedBook,
    isLateralMenuOpen,
    setIsLateralMenuOpen,
    openBook,
    onUpdatePopularBook,
    onUpdateRating,

    lastRating: {
      data: userLatestRating,
      isLoading: isValidatingUserLatestRating || isValidatingReview,
      error: userLatestRatingError,
    },
    featured: {
      data: featuredData,
      isLoading: isValidatingFeatured && !featuredData,
    },
    recommended: {
      books: recommendedData?.books,
      hasEnoughData: recommendedData?.hasEnoughData,
      isLoading: isValidatingRecommended || !recommendedData,
    },
    trending: {
      books: trendingBooks,
      isLoading: !trendingBooks,
    },
    community: {
      ratings: latestRatings,
      error: latestRatingsError,
    },
    popularBooks,
  }
}
