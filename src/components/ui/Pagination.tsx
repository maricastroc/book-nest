import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

type PageItem = number | 'left-dots' | 'right-dots'

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblings = 1,
): PageItem[] {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  // first + last + current + 2 siblings + 2 dots
  const totalSlots = siblings * 2 + 5

  if (totalPages <= totalSlots) {
    return range(1, totalPages)
  }

  const leftSibling = Math.max(currentPage - siblings, 1)
  const rightSibling = Math.min(currentPage + siblings, totalPages)

  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < totalPages - 1

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + siblings * 2), 'right-dots', totalPages]
  }

  if (showLeftDots && !showRightDots) {
    return [
      1,
      'left-dots',
      ...range(totalPages - (2 + siblings * 2), totalPages),
    ]
  }

  return [
    1,
    'left-dots',
    ...range(leftSibling, rightSibling),
    'right-dots',
    totalPages,
  ]
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPaginationRange(currentPage, totalPages)

  const arrowClass =
    'flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-s1 text-fg2 transition-all hover:border-line-strong hover:text-fg disabled:pointer-events-none disabled:opacity-35'

  return (
    <div className="bn-scope flex select-none items-center gap-1.5">
      <button
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={arrowClass}
      >
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 14 }} />
      </button>

      {pages.map((page) => {
        if (page === 'left-dots' || page === 'right-dots') {
          return (
            <span
              key={page}
              aria-hidden
              className="flex h-9 w-9 items-end justify-center pb-1.5 text-fg3"
            >
              …
            </span>
          )
        }

        const isActive = page === currentPage

        return (
          <button
            key={page}
            data-active={isActive}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-[10px] border text-[13.5px] transition-all ${
              isActive
                ? 'border-ac-border bg-ac-soft font-semibold text-ac shadow-[0_0_0_1px_var(--color-ac-border)]'
                : 'border-line bg-s1 font-medium text-fg2 hover:border-line-strong hover:text-fg'
            }`}
          >
            {page}
          </button>
        )
      })}

      <button
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={arrowClass}
      >
        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 14 }} />
      </button>
    </div>
  )
}
