import { BookProps } from '@/@types/book'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import { StarsRating } from '@/components/features/books/StarsRating'
import { useRouter } from 'next/router'
import { DID_NOT_FINISH_STATUS, READ_STATUS } from '@/utils/constants'
import { HorizontalScroll } from '@/components/ui/HorizontalScroll'
import { ReadingStatusTag } from '@/components/features/books/ReadingStatusTag'

interface BookStatusListProps {
  isLoggedUser: boolean
  status: 'read' | 'reading' | 'wantToRead' | 'didNotFinish' | null
  statusLabel: string
  books: BookProps[] | undefined
  emptyBoxMessage?: string
  onSelect: (book: BookProps) => void
  onStatusClick: () => void
}

export function BookStatusList({
  status,
  statusLabel,
  books,
  emptyBoxMessage,
  isLoggedUser,
  onStatusClick,
  onSelect,
}: BookStatusListProps) {
  const router = useRouter()
  const count = books?.length ?? 0
  const showRating = status === READ_STATUS || status === DID_NOT_FINISH_STATUS

  return (
    <div className="flex w-full flex-col gap-3 border-b border-line/50 py-5 last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ReadingStatusTag readingStatus={status} type="relative" />
          <span className="text-[1.05rem] font-semibold text-fg">
            {statusLabel}
          </span>
          <span className="text-[0.8rem] text-fg3">
            {count} {count === 1 ? 'book' : 'books'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedUser && books && books.length > 0 && (
            <button
              onClick={() => router.push('/explore')}
              className="flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-[0.72rem] text-fg3 transition-colors hover:border-line-strong hover:text-fg2"
            >
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} />
              Add
            </button>
          )}
          <button
            onClick={onStatusClick}
            className="flex items-center gap-1 text-[0.8rem] font-medium text-fg2 transition-colors hover:text-ac"
          >
            View All
            <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 12 }} />
          </button>
        </div>
      </div>

      <div className="pt-1">
        {books && books.length > 0 ? (
          <HorizontalScroll scrollAmount={320} fadeColor="var(--color-bg)">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelect(book)}
                className="group flex cursor-pointer flex-col items-center gap-1.5 pt-1 text-center"
              >
                <img
                  src={book.coverUrl}
                  alt={`Cover of ${book.name}`}
                  className="h-[7.8rem] w-20 rounded-lg object-cover shadow-[0_6px_18px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-line transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_14px_30px_rgba(0,0,0,0.6)] group-hover:brightness-110"
                />
                <div className="flex w-20 flex-col items-center gap-0.5 pb-1">
                  <p className="line-clamp-1 w-full text-[0.72rem] font-semibold text-fg2 transition-colors group-hover:text-fg">
                    {book.name}
                  </p>
                  <p className="line-clamp-1 w-full text-[0.67rem] uppercase tracking-wide text-fg3">
                    {book.author}
                  </p>
                  {showRating && (book?.userRating ?? 0) > 0 && (
                    <StarsRating size="smaller" rating={book.userRating ?? 0} />
                  )}
                </div>
              </div>
            ))}
          </HorizontalScroll>
        ) : (
          <div className="flex h-32 items-center gap-5">
            <div
              onClick={() => router.push('/explore')}
              className="flex h-[7.8rem] w-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed border-line-strong text-fg3 transition-colors hover:border-fg3 hover:text-fg2"
            >
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: 18 }} />
            </div>
            <p className="max-w-56 text-[0.83rem] leading-relaxed text-fg3">
              {emptyBoxMessage ?? ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
