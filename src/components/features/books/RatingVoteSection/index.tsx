import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { RatingActions, RatingButton } from './styles'
import { RatingProps } from '@/@types/rating'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useSession } from 'next-auth/react'
import { useRatings } from '@/contexts/RatingsContext'
import { useBookContext } from '@/contexts/BookContext'

interface Props {
  rating: RatingProps
  style?: React.CSSProperties
}

export const RatingVoteSection = ({ rating, style }: Props) => {
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

  return (
    <RatingActions style={style}>
      <RatingButton disabled={!!isOwner}>
        <FontAwesomeIcon
          icon={faThumbsUp}
          onClick={() => handleVote('UP')}
          className={userVote === 'UP' ? 'text-ac' : ''}
        />
        <p>Helpful • {currentRating.votes?.up ?? 0}</p>
      </RatingButton>
      <RatingButton disabled={!!isOwner}>
        <FontAwesomeIcon
          icon={faThumbsDown}
          onClick={() => handleVote('DOWN')}
          className={userVote === 'DOWN' ? 'text-ac' : ''}
        />
        <p>{currentRating.votes?.down ?? 0}</p>
      </RatingButton>
    </RatingActions>
  )
}
