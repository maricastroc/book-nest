import { useState, useEffect } from 'react'
import useRequest from './useRequest'
import { RatingProps } from '@/@types/rating'
import { usePaginationAndSearch } from './usePaginationAndSearchParams'

export const useProfileRatings = (userId?: string) => {
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
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    searchTerm,
    perPage,
  } = usePaginationAndSearch({ perPage: 6 })

  const ratingsRequest = userId
    ? {
        url: `/profile/ratings/${userId}`,
        method: 'GET',
        params: {
          search: searchTerm,
          page: currentPage,
          perPage,
        },
      }
    : null

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
  }>(ratingsRequest, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  useEffect(() => {
    if (ratingsData) {
      setUserRatings(ratingsData.ratings)
    }
  }, [ratingsData])

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
