/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState, useMemo } from 'react'
import { RatingProps } from '@/@types/rating'

type RatingGroup = {
  [key: string]: RatingProps[]
}

type RatingsContextType = {
  ratingGroups: RatingGroup
  updateRating: (ratingId: string, updatedRating: RatingProps) => void
  registerRatingGroup: (groupKey: string, initialRatings: RatingProps[]) => void
  getRating: (ratingId: string) => RatingProps | undefined
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined)

export function useRatings() {
  const context = useContext(RatingsContext)

  if (!context) {
    throw new Error('useRatings must be used within a RatingsProvider')
  }

  return context
}

export function RatingsProvider({ children }: { children: React.ReactNode }) {
  const [ratingGroups, setRatingGroups] = useState<RatingGroup>({})

  const registerRatingGroup = (
    groupKey: string,
    initialRatings: RatingProps[],
  ) => {
    setRatingGroups((prev) => ({
      ...prev,
      [groupKey]: initialRatings,
    }))
  }

  const updateRating = (ratingId: string, updatedRating: RatingProps) => {
    setRatingGroups((prev) => {
      const newGroups = { ...prev }
      for (const groupKey in newGroups) {
        newGroups[groupKey] = newGroups[groupKey].map((r) =>
          r.id === ratingId ? updatedRating : r,
        )
      }
      return newGroups
    })
  }

  const getRating = (ratingId: string) => {
    for (const groupKey in ratingGroups) {
      const found = ratingGroups[groupKey].find((r) => r.id === ratingId)
      if (found) return found
    }
    return undefined
  }

  const value = useMemo(
    () => ({
      ratingGroups,
      updateRating,
      registerRatingGroup,
      getRating,
    }),
    [ratingGroups],
  )

  return (
    <RatingsContext.Provider value={value}>{children}</RatingsContext.Provider>
  )
}
