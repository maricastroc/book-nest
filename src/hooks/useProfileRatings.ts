import { useState, useEffect } from 'react'
import useRequest from './useRequest'
import { RatingProps } from '@/@types/rating'

export const useProfileRatings = (userId?: string) => {
  const [search, setSearch] = useState('')

  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [currentPage, setCurrentPage] = useState(1)

  const [userRatings, setUserRatings] = useState<RatingProps[] | undefined>()

  const onUpdateReview = async (updatedReview: RatingProps) => {
    setUserRatings((prevRatings) =>
      prevRatings?.map((rating) =>
        rating.id === updatedReview.id
          ? {
              ...rating,
              rate: updatedReview.rate,
              description: updatedReview.description,
            }
          : rating,
      ),
    )
  }

  const onCreateReview = (newRating: RatingProps) => {
    setUserRatings((prevRatings) => [...(prevRatings || []), newRating])
  }

  const onDeleteReview = (ratingId: string) => {
    setUserRatings((prevRatings) =>
      prevRatings?.filter((rating) => rating.id !== ratingId),
    )
  }

  const {
    data: ratingsData,
    mutate: mutateRatings,
    isValidating: isValidatingRatings,
  } = useRequest<{
    ratings: RatingProps[]
    pagination: {
      currentPage: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }>(
    {
      url: userId ? `/profile/ratings/${userId}` : undefined,
      method: 'GET',
      params: {
        search: debouncedSearch,
        page: currentPage,
        pageSize: 6,
      },
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      keepPreviousData: true,
    },
  )

  useEffect(() => {
    if (ratingsData) {
      setUserRatings(ratingsData.ratings)
    }
  }, [ratingsData])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  return {
    ratings: userRatings || [],
    totalPages: ratingsData?.pagination?.totalPages || 1,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    isValidatingRatings,
    mutateRatings,
    onCreateReview,
    onDeleteReview,
    onUpdateReview,
  }
}
