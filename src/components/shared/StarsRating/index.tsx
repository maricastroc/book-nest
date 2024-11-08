import { Star, StarHalf } from 'phosphor-react'
import { Rating } from './styles'

interface StarsRatingProps {
  rating: number
  variant?: string | null
}

export function StarsRating({ rating, variant = null }: StarsRatingProps) {
  return (
    <Rating className={variant || ''}>
      {Array.from({ length: 5 }).map((_, i) => {
        return rating < i + 1 && rating > i ? (
          <StarHalf key={i} weight="fill" />
        ) : (
          <Star key={i} weight={rating >= i + 1 ? 'fill' : undefined} />
        )
      })}
    </Rating>
  )
}
