import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'
interface StarsRatingProps {
  rating: number
  variant?: string | null
  size?: string | null
}

export function StarsRating({ rating, size = null }: StarsRatingProps) {
  const isSmall = size === 'smaller'

  return (
    <div className={`flex items-center gap-px ${isSmall ? 'opacity-80' : ''}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isHalf = rating < i + 1 && rating > i
        const isFull = rating >= i + 1
        return isHalf ? (
          <FontAwesomeIcon
            icon={faStarHalfStroke}
            key={i}
            className={`text-ac ${isSmall ? 'text-[0.8rem]' : 'text-[1rem]'}`}
          />
        ) : (
          <FontAwesomeIcon
            icon={faStar}
            key={i}
            className={`text-ac ${isSmall ? 'text-[0.8rem]' : 'text-[1rem]'} ${
              !isFull ? 'opacity-25' : ''
            }`}
          />
        )
      })}
    </div>
  )
}
