import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import { RatingCard } from '@/components/features/books/RatingCard'
import { SkeletonRatingCard } from '@/components/features/books/SkeletonRatingCard'
import { EmptyContainer } from '@/components/ui/EmptyContainer'
import { SectionLabel } from './SectionLabel'

interface CommunityFeedProps {
  ratings: RatingProps[] | undefined
  error: unknown
  onOpenBook: (book: BookProps) => void
}

export function CommunityFeed({
  ratings,
  error,
  onOpenBook,
}: CommunityFeedProps) {
  const renderContent = () => {
    if (error)
      return <EmptyContainer content="recent ratings" variant="error" />
    if (!ratings?.length) {
      return Array.from({ length: 9 }).map((_, i) => (
        <SkeletonRatingCard key={i} />
      ))
    }
    return ratings.map((rating) => (
      <RatingCard
        key={rating.id}
        rating={rating}
        onOpenDetails={() => {
          if (rating?.book) onOpenBook(rating.book)
        }}
      />
    ))
  }

  return (
    <section>
      <SectionLabel>From the community</SectionLabel>
      <div className="flex flex-col gap-4">{renderContent()}</div>
    </section>
  )
}
