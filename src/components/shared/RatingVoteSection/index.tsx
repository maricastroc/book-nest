import { ThumbsDown, ThumbsUp } from 'phosphor-react'
import { RatingActions, RatingWrapper } from './styles'
import { useBookContext } from '@/contexts/BookContext'
import { RatingProps } from '@/@types/rating'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useSession } from 'next-auth/react'

interface Props {
  rating: RatingProps
}

export const RatingVoteSection = ({ rating }: Props) => {
  const { onUpdateBookRatings, bookRatings } = useBookContext()

  const { data: session } = useSession()

  const currentRating = bookRatings.find((r) => r.id === rating.id) ?? rating

  const userVote = currentRating.votes?.userVote

  async function handleVote(type: 'UP' | 'DOWN') {
    if (!session) {
      return
    }

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

      const updatedRatings = bookRatings.map((r) =>
        r.id === currentRating.id
          ? {
              ...r,
              votes: {
                ...r.votes,
                up: newUp,
                down: newDown,
                userVote: newUserVote,
              },
            }
          : r,
      )

      onUpdateBookRatings(updatedRatings)

      await api.post('/ratings/vote', { ratingId: currentRating.id, type })
    } catch (error) {
      onUpdateBookRatings(bookRatings)
      handleApiError(error)
    }
  }

  return (
    <RatingActions>
      <RatingWrapper>
        <ThumbsUp
          onClick={() => handleVote('UP')}
          weight={userVote === 'UP' ? 'fill' : 'regular'}
          color={userVote === 'UP' ? '#50B2C0' : undefined}
        />
        <p>Helpful • {currentRating.votes?.up ?? 0}</p>
      </RatingWrapper>
      <RatingWrapper>
        <ThumbsDown
          onClick={() => handleVote('DOWN')}
          weight={userVote === 'DOWN' ? 'fill' : 'regular'}
          color={userVote === 'DOWN' ? '#50B2C0' : undefined}
        />
        <p>{currentRating.votes?.down ?? 0}</p>
      </RatingWrapper>
    </RatingActions>
  )
}
