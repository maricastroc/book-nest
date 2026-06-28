import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { BookProps } from '@/@types/book'
import { CategoryProps } from '@/@types/category'

function getFirstCategoryName(
  categories: BookProps['categories'],
): string | null {
  const first = categories?.[0] as
    | CategoryProps
    | { category?: CategoryProps | null }
    | undefined

  if (!first) return null
  if ('name' in first) return first.name ?? null
  return first.category?.name ?? null
}

interface ExploreCardProps {
  book: BookProps
  onOpenDetails: () => void
}

export function ExploreCard({ book, onOpenDetails }: ExploreCardProps) {
  const firstCategory = getFirstCategoryName(book.categories)

  return (
    <button
      onClick={onOpenDetails}
      className="bn-scope group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-line bg-s1 text-left transition-colors hover:border-line-strong"
    >
      <div className="relative flex items-center justify-center bg-s2/50 px-6 pb-0 pt-5">
        <div className="relative">
          <img
            src={book.coverUrl}
            alt={book.name}
            className="h-39 w-auto max-w-full rounded-sm object-contain shadow-[0_12px_28px_rgba(0,0,0,0.6)] transition-[filter] group-hover:brightness-110"
          />

          {book.rate && book.rate > 0 && (
            <div className="absolute -bottom-2.5 -right-2.5 flex items-center gap-0.75 rounded-full border border-line/50 bg-bg/90 px-2 py-0.75 shadow-sm backdrop-blur-sm">
              <FontAwesomeIcon
                icon={faStar}
                className="text-ac"
                style={{ fontSize: 9 }}
              />
              <span className="text-[10px] font-semibold leading-none text-fg">
                {book.rate.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center px-3 pb-3 pt-4 text-center">
        <p className="w-full truncate text-[14.5px] font-semibold leading-snug text-fg">
          {book.name}
        </p>
        <p className="mt-1 w-full truncate text-[12.5px] text-fg2">
          {book.author}
        </p>
        {firstCategory && (
          <p className="mt-2 text-[11px] text-fg2/60">{firstCategory}</p>
        )}
      </div>
    </button>
  )
}
