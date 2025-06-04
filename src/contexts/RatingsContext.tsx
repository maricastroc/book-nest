import { createContext, useContext, useState } from 'react'
import { RatingProps } from '@/@types/rating'

type RatingsContextType = {
  ratings: RatingProps[]
  updatedRating: RatingProps | null
  updateRating: (updatedRating: RatingProps) => void
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined)

export function RatingsProvider({
  children,
  initialRatings,
}: {
  children: React.ReactNode
  initialRatings: RatingProps[]
}) {
  const [ratings, setRatings] = useState<RatingProps[]>(initialRatings)

  const [updatedRating, setUpdatedRating] = useState<RatingProps | null>(null)

  const updateRating = (updatedRating: RatingProps) => {
    setRatings((prev) =>
      prev.map((r) => (r.id === updatedRating.id ? updatedRating : r)),
    )

    setUpdatedRating(updatedRating)
  }

  return (
    <RatingsContext.Provider value={{ ratings, updatedRating, updateRating }}>
      {children}
    </RatingsContext.Provider>
  )
}

export function useRatings() {
  const context = useContext(RatingsContext)
  if (!context) {
    throw new Error('useRatings must be used within a RatingsProvider')
  }
  return context
}
