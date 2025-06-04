import { ThumbsDown, ThumbsUp } from 'phosphor-react'
import { RatingActions, RatingButton } from './styles'
import { RatingProps } from '@/@types/rating'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useSession } from 'next-auth/react'
import { useRatings } from '@/contexts/RatingsContext'

interface Props {
  rating: RatingProps
}

export const RatingVoteSection = ({ rating }: Props) => {
  const { updateRating, updatedRating } = useRatings()

  const { data: session } = useSession()

  const userVote = updatedRating
    ? updatedRating.votes?.userVote
    : rating.votes?.userVote

  async function handleVote(type: 'UP' | 'DOWN') {
    if (!session) {
      return
    }

    try {
      const currentUp = updatedRating
        ? updatedRating.votes.up
        : rating.votes?.up ?? 0
      const currentDown = updatedRating
        ? updatedRating.votes.down
        : rating.votes?.down ?? 0

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

      updateRating({
        ...rating,
        votes: {
          ...rating.votes,
          up: newUp,
          down: newDown,
          userVote: newUserVote,
        },
      })

      await api.post('/ratings/vote', { ratingId: rating.id, type })
    } catch (error) {
      updateRating(rating)
      handleApiError(error)
    }
  }

  return (
    <RatingActions>
      <RatingButton disabled={rating.userId === session?.user?.id}>
        <ThumbsUp
          onClick={() => handleVote('UP')}
          weight={userVote === 'UP' ? 'fill' : 'regular'}
          color={userVote === 'UP' ? '#50B2C0' : undefined}
        />
        <p>
          Helpful •{' '}
          {updatedRating ? updatedRating.votes.up : rating.votes?.up ?? 0}
        </p>
      </RatingButton>

      <RatingButton disabled={rating.userId === session?.user?.id}>
        <ThumbsDown
          onClick={() => handleVote('DOWN')}
          weight={userVote === 'DOWN' ? 'fill' : 'regular'}
          color={userVote === 'DOWN' ? '#50B2C0' : undefined}
        />
        <p>
          {updatedRating ? updatedRating.votes.down : rating.votes?.down ?? 0}
        </p>
      </RatingButton>
    </RatingActions>
  )
}
