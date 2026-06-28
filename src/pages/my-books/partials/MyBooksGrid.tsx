import {
  faBook,
  faMagnifyingGlass,
  faBookMedical,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BookProps } from '@/@types/book'
import { EmptyContainer } from '@/components/ui/EmptyContainer'
import { ExploreCard } from '@/pages/explore/partials/ExploreCard'

interface Props {
  books: BookProps[] | null
  filteredBooks: BookProps[]
  search: string
  isValidating: boolean
  error: unknown
  onOpenDetails: (book: BookProps) => void
  onSubmitFirst: () => void
}

const SKELETON_COUNT = 12

export function MyBooksGrid({
  books,
  filteredBooks,
  search,
  isValidating,
  error,
  onOpenDetails,
  onSubmitFirst,
}: Props) {
  const gridClass =
    'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

  if (isValidating) {
    return (
      <div className={gridClass}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col gap-2 rounded-xl bg-s1 p-2"
          >
            <div className="aspect-2/3 w-full rounded-md bg-s2" />
            <div className="mt-1 h-3 w-3/4 rounded bg-s2" />
            <div className="h-2.5 w-1/2 rounded bg-s2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <EmptyContainer content="submitted books" variant="error" />
  }

  if (!books?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line py-20 text-center">
        <FontAwesomeIcon
          icon={faBook}
          className="text-fg3"
          style={{ fontSize: 32 }}
        />
        <p className="text-[13.5px] text-fg3">
          You haven&apos;t submitted any books yet
        </p>
        <button
          onClick={onSubmitFirst}
          className="mt-1 flex items-center gap-2 rounded-[10px] bg-ac px-4 py-2 text-[13px] font-semibold text-ac-ink transition-opacity hover:opacity-90"
        >
          <FontAwesomeIcon
            icon={faBookMedical}
            style={{ width: 14, height: 14 }}
          />
          Submit your first book
        </button>
      </div>
    )
  }

  if (!filteredBooks.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-fg3">
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: 28 }} />
        <p className="text-[13.5px]">No books match &ldquo;{search}&rdquo;</p>
      </div>
    )
  }

  return (
    <div className={gridClass}>
      {filteredBooks.map((book) => (
        <ExploreCard
          key={book.id}
          book={book}
          onOpenDetails={() => onOpenDetails(book)}
        />
      ))}
    </div>
  )
}
