import { ThumbsDown, ThumbsUp } from 'phosphor-react'
import { RatingActions, RatingButton } from './styles'
import { RatingProps } from '@/@types/rating'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useSession } from 'next-auth/react'
import { useRatings } from '@/contexts/RatingsContext'

interface Props {
  rating: RatingProps
  style?: React.CSSProperties // 👈 permite passar estilos inline
}

export const RatingVoteSection = ({ rating, style }: Props) => {
  const { updateRating, getRating } = useRatings()
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
    } catch (error) {
      updateRating(rating.id, currentRating)
      handleApiError(error)
    }
  }

  return (
    <RatingActions style={style}>
      {' '}
      {/* 👈 repassando style */}
      <RatingButton disabled={isOwner}>
        <ThumbsUp
          onClick={() => handleVote('UP')}
          weight={userVote === 'UP' ? 'fill' : 'regular'}
          color={userVote === 'UP' ? '#50B2C0' : undefined}
        />
        <p>Helpful • {currentRating.votes?.up ?? 0}</p>
      </RatingButton>
      <RatingButton disabled={isOwner}>
        <ThumbsDown
          onClick={() => handleVote('DOWN')}
          weight={userVote === 'DOWN' ? 'fill' : 'regular'}
          color={userVote === 'DOWN' ? '#50B2C0' : undefined}
        />
        <p>{currentRating.votes?.down ?? 0}</p>
      </RatingButton>
    </RatingActions>
  )
}
