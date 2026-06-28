import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { RatingProps } from '@/@types/rating'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useSession } from 'next-auth/react'
import { useRatings } from '@/contexts/RatingsContext'
import { useBookContext } from '@/contexts/BookContext'

interface Props {
  rating: RatingProps
  className?: string
}

export const RatingVoteSection = ({ rating, className }: Props) => {
  const { updateRating, getRating } = useRatings()

  const { bookData } = useBookContext()

  const { data: session } = useSession()

  const currentRating = getRating(rating.id) || rating
  const userVote = currentRating.votes?.userVote
  const isOwner = rating.userId === session?.user?.id

  async function handleVote(type: 'UP' | 'DOWN') {
    if (!session || isOwner) return

    try {
      const currentUp = currentRating.votes?.up ?? 0
      const currentDown = currentRating.votes?.down ?? 0

      let newUp = currentUp
      let newDown = currentDown
      let newUserVote: 'UP' | 'DOWN' | null = type

      if (userVote === type) {
        newUserVote = null
        type === 'UP' ? newUp-- : newDown--
      } else if (userVote) {
        type === 'UP' ? newUp++ : newDown++
        userVote === 'UP' ? newUp-- : newDown--
      } else {
        type === 'UP' ? newUp++ : newDown++
      }

      updateRating(rating.id, {
        ...currentRating,
        votes: {
          up: newUp,
          down: newDown,
          userVote: newUserVote,
        },
      })

      await api.post('/ratings/vote', { ratingId: rating.id, type })

      await bookData?.mutate()
    } catch (error) {
      updateRating(rating.id, currentRating)
      handleApiError(error)
    }
  }

  const buttonBase =
    'flex items-center gap-1.5 bg-transparent border-none text-fg3 cursor-pointer transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:text-fg2'

  return (
    <div
      className={`flex w-full items-center gap-3 mt-3 pt-3 border-t border-white/6 ${
        className ?? ''
      }`}
    >
      <button
        disabled={!!isOwner}
        onClick={() => handleVote('UP')}
        className={buttonBase}
      >
        <FontAwesomeIcon
          icon={faThumbsUp}
          className={`text-[0.9rem] ${
            userVote === 'UP' ? 'text-ac' : 'text-inherit'
          }`}
        />
        <p className="text-[0.78rem] font-medium">
          Helpful • {currentRating.votes?.up ?? 0}
        </p>
      </button>
      <button
        disabled={!!isOwner}
        onClick={() => handleVote('DOWN')}
        className={buttonBase}
      >
        <FontAwesomeIcon
          icon={faThumbsDown}
          className={`text-[0.9rem] ${
            userVote === 'DOWN' ? 'text-ac' : 'text-inherit'
          }`}
        />
        <p className="text-[0.78rem] font-medium">
          {currentRating.votes?.down ?? 0}
        </p>
      </button>
    </div>
  )
}
