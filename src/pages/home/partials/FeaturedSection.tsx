import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import { CoverStoryCard } from '@/components/features/books/CoverStoryCard'
import { SkeletonRatingCard } from '@/components/features/books/SkeletonRatingCard'

interface FeaturedSectionProps {
  rating: RatingProps | null | undefined
  isLoading: boolean
  onOpenBook: (book: BookProps) => void
}

export function FeaturedSection({
  rating,
  isLoading,
  onOpenBook,
}: FeaturedSectionProps) {
  if (isLoading) {
    return (
      <section>
        <SkeletonRatingCard withMarginBottom />
      </section>
    )
  }

  if (!rating?.book) return null

  const { book } = rating

  return (
    <section>
      <CoverStoryCard
        rating={rating}
        eyebrow="Book of the week"
        reviewerName={rating.user?.name}
        onOpenDetails={() => onOpenBook(book)}
      />
    </section>
  )
}
