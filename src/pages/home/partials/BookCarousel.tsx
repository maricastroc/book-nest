import { BookProps } from '@/@types/book'
import { BookCard } from '@/components/features/books/BookCard'
import { SkeletonBookCard } from '@/components/features/books/SkeletonBookCard'
import { HorizontalScroll } from '@/components/ui/HorizontalScroll'
import { SectionLabel } from './SectionLabel'

interface BookCarouselProps {
  title: string
  books: BookProps[] | undefined
  isLoading: boolean
  onOpenBook: (book: BookProps) => void
  skeletonCount?: number
  emptyMessage?: string
}

export function BookCarousel({
  title,
  books,
  isLoading,
  onOpenBook,
  skeletonCount = 3,
  emptyMessage,
}: BookCarouselProps) {
  const renderContent = () => {
    if (emptyMessage) {
      return <p className="text-[12px] italic text-fg3">{emptyMessage}</p>
    }
    if (isLoading || !books) {
      return (
        <HorizontalScroll>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonBookCard key={i} />
          ))}
        </HorizontalScroll>
      )
    }
    return (
      <HorizontalScroll>
        {books.map((book) => (
          <div key={book.id} className="w-76 shrink-0">
            <BookCard book={book} onOpenDetails={() => onOpenBook(book)} />
          </div>
        ))}
      </HorizontalScroll>
    )
  }

  return (
    <section>
      <SectionLabel>{title}</SectionLabel>
      {renderContent()}
    </section>
  )
}
