import { Star } from 'phosphor-react'
import { Rating } from './styles'

interface StarsRatingProps {
  rating: number
}

export function StarsRating({ rating }: StarsRatingProps) {
  console.log(rating)
  return (
    <Rating>
      {Array.from({ length: 5 }).map((_, i) => {
        return <Star key={i} weight={rating >= i + 1 ? 'fill' : undefined} />
      })}
    </Rating>
  )
}
