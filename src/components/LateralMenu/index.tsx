/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BookWithRatingAndCategories } from '@/pages/home/index.page'
import {
  CloseButton,
  Container,
  ContainerOverlay,
  LateralMenuContainer,
  RatingsContainer,
  RatingsContent,
  RatingsContentTitle,
} from './styles'
import { BookCard } from './components/BookCard'
import { X } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { Rating as RatingInfo, User as UserPrisma } from '@prisma/client'
import { RatingCard } from './components/RatingCard'
import { useSession } from 'next-auth/react'
import { ReviewCardForm } from './components/ReviewCardForm'

interface BookReviewsSidebarProps {
  book: BookWithRatingAndCategories | null
  onClose: () => void
}

interface RatingProps extends RatingInfo {
  user: UserPrisma
}

export function LateralMenu({ book, onClose }: BookReviewsSidebarProps) {
  const [ratings, setRatings] = useState<RatingProps[]>([])
  const [openReviewForm, setOpenReviewForm] = useState(false)

  const session = useSession()

  useEffect(() => {
    async function loadRatings() {
      const response = await api.get(`/books/${book?.id!}`)
      if (response.data) {
        setRatings(response.data.book.ratings)
      }
    }
    loadRatings()
  }, [book?.id])

  return (
    <Container>
      <CloseButton onClick={() => onClose()}>
        <X />
      </CloseButton>
      <ContainerOverlay />
      <LateralMenuContainer>
        <BookCard
          name={book?.name!}
          author={book?.author!}
          cover_url={book?.cover_url!}
          rating={book?.rating!}
          ratings_number={book?.ratings.length!}
          total_pages={book?.total_pages!}
          categories={book?.categories!}
        />
        <RatingsContainer>
          <RatingsContentTitle>
            <p>Ratings</p>
            {session.data?.user && (
              <span onClick={() => setOpenReviewForm(true)}>Review</span>
            )}
          </RatingsContentTitle>
          {session.data?.user && openReviewForm && (
            <ReviewCardForm
              avatar_url={session.data?.user.avatar_url!}
              name={session.data?.user.name!}
              onClose={() => setOpenReviewForm(false)}
              onCloseLateralMenu={() => onClose()}
              bookId={book?.id!}
              userId={session.data?.user.id}
            />
          )}
          <RatingsContent>
            {ratings?.map((rating) => (
              <RatingCard
                key={rating.id}
                id={rating.id}
                avatar_url={rating.user.avatar_url}
                name={rating.user.name}
                created_at={rating.created_at}
                rating={rating.rate}
                description={rating.description}
                user={rating.user_id}
                onCloseLateralMenu={() => onClose()}
              />
            ))}
          </RatingsContent>
        </RatingsContainer>
      </LateralMenuContainer>
    </Container>
  )
}
