import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

import { BookProps } from '@/@types/book'
import { StarsRating } from '@/components/features/books/StarsRating'
import { getBookRatingsNumber } from '@/utils/getBookRatingsNumber'

interface BookCardProps {
  book: BookProps
  onOpenDetails: () => void
  onClose?: () => void
}

export function BookCard({ book, onOpenDetails }: BookCardProps) {
  // Prefer the taste-based reason ("Because you like …") when present.
  const reason =
    book.recommendation?.reasons?.find((r) => r.kind === 'affinity') ??
    book.recommendation?.reasons?.[0]

  return (
    <div
      onClick={onOpenDetails}
      className="bn-scope flex w-full cursor-pointer items-stretch gap-3 rounded-[10px] border border-line bg-s1 p-3 transition-colors hover:border-line-strong hover:bg-s2 sm:gap-4 sm:p-4"
    >
      <img
        src={book.coverUrl}
        alt={`Cover of ${book.name}`}
        className="w-18 shrink-0 self-start rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.45)] sm:w-21"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h2 className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-fg sm:text-[14px]">
            {book.name}
          </h2>
          <p className="mt-0.5 text-[12px] text-fg3">{book.author}</p>
        </div>
        <div className="mt-2 flex flex-col gap-0.5">
          <p className="text-[11px] text-fg3">{getBookRatingsNumber(book)}</p>
          <StarsRating rating={book?.rate ?? 0} size="smaller" />
          {reason && (
            <span
              title={reason.label}
              className="mt-1.5 inline-flex w-fit items-center gap-1.5 rounded-full border border-ac-border bg-ac-soft px-2 py-0.5 text-[10.5px] font-medium text-ac"
            >
              <FontAwesomeIcon
                icon={faWandMagicSparkles}
                className="text-[9px]"
              />
              <span className="line-clamp-1">{reason.label}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
