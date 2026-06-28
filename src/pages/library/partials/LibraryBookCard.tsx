import { BookProps } from '@/@types/book'
import { StarsRating } from '@/components/features/books/StarsRating'

interface BookCardProps {
  book: BookProps
  onSelect: (value: BookProps) => void
  size?: string
  onClose?: () => void
}

export function LibraryBookCard({ book, onSelect }: BookCardProps) {
  return (
    <div
      onClick={() => onSelect(book)}
      className="flex cursor-pointer flex-col items-center gap-1.5 text-center"
    >
      <img
        src={book.coverUrl}
        alt={`Cover of ${book.name}`}
        className="h-30 w-[5.2rem] rounded-lg object-cover shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-[filter] hover:brightness-110"
      />
      <div className="flex w-[5.2rem] flex-col items-center">
        <p className="line-clamp-1 text-[0.75rem] font-semibold text-fg">
          {book.name}
        </p>
        <p className="line-clamp-1 text-[0.7rem] uppercase text-fg3">
          {book.author}
        </p>
        <StarsRating size="smaller" rating={book?.userRating || 0} />
      </div>
    </div>
  )
}
