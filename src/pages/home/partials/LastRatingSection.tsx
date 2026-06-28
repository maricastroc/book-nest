import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import { CoverStoryCard } from '@/components/features/books/CoverStoryCard'
import { SkeletonRatingCard } from '@/components/features/books/SkeletonRatingCard'
import { EmptyContainer } from '@/components/ui/EmptyContainer'
import { SectionLabel } from './SectionLabel'

interface LastRatingSectionProps {
  rating: RatingProps | null | undefined
  isLoading: boolean
  error: unknown
  onOpenBook: (book: BookProps) => void
}

export function LastRatingSection({
  rating,
  isLoading,
  error,
  onOpenBook,
}: LastRatingSectionProps) {
  const renderContent = () => {
    if (isLoading) return <SkeletonRatingCard withMarginBottom />
    if (error)
      return <EmptyContainer content="reading history" variant="error" />
    if (rating?.book) {
      const { book } = rating
      return (
        <CoverStoryCard
          rating={rating}
          onOpenDetails={() => onOpenBook(book)}
        />
      )
    }
    return <EmptyContainer />
  }

  return (
    <section>
      <SectionLabel>Your last rating</SectionLabel>
      {renderContent()}
    </section>
  )
}
