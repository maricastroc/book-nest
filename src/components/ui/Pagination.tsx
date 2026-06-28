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
    'flex h-8 w-8 items-center justify-center rounded-full text-fg2 transition-colors hover:bg-s1 hover:text-fg disabled:pointer-events-none disabled:text-fg3 disabled:opacity-60'

  return (
    <div className="bn-scope flex select-none items-center gap-1">
      <button
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={arrowClass}
      >
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 13 }} />
      </button>

      {pages.map((page) => {
        if (page === 'left-dots' || page === 'right-dots') {
          return (
            <span
              key={page}
              aria-hidden
              className="flex h-8 w-8 items-end justify-center pb-2 text-fg3"
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
            className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[13px] transition-colors ${
              isActive
                ? 'bg-ac font-semibold text-ac-ink'
                : 'font-medium text-fg3 hover:bg-s1 hover:text-fg'
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
        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 13 }} />
      </button>
    </div>
  )
}
