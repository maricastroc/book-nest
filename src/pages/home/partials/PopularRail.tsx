import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { BookProps } from '@/@types/book'
import { BookCard } from '@/components/features/books/BookCard'
import { SkeletonBookCard } from '@/components/features/books/SkeletonBookCard'
import { SectionLabel } from './SectionLabel'

interface PopularRailProps {
  books: BookProps[]
  onViewAll: () => void
  onOpenBook: (book: BookProps) => void
}

export function PopularRail({
  books,
  onViewAll,
  onOpenBook,
}: PopularRailProps) {
  const hasBooks = books.length > 0

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <SectionLabel noMargin>Popular this week</SectionLabel>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-[11px] font-medium text-ac transition-colors hover:text-fg"
        >
          View all{' '}
          <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 11 }} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {!hasBooks
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-start gap-1">
                <span className="w-5 shrink-0 select-none pt-1 font-serif text-[15px] font-semibold leading-tight text-fg3/40">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <SkeletonBookCard />
                </div>
              </div>
            ))
          : books.map((book, i) => (
              <div key={book.id} className="flex items-start gap-1">
                <span className="w-5 shrink-0 select-none pt-1 font-serif text-[15px] font-semibold leading-tight text-fg3">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <BookCard
                    book={book}
                    onOpenDetails={() => onOpenBook(book)}
                  />
                </div>
              </div>
            ))}
      </div>
    </>
  )
}
