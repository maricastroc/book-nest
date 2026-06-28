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

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="bn-scope flex items-center gap-1.5">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-line bg-s1 text-fg2 transition-colors hover:border-line-strong hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 16 }} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-9 w-9 items-center justify-center rounded-[8px] border text-[13.5px] font-medium transition-colors ${
            page === currentPage
              ? 'border-ac bg-ac-soft text-ac'
              : 'border-line bg-s1 text-fg2 hover:border-line-strong hover:text-fg'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-line bg-s1 text-fg2 transition-colors hover:border-line-strong hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 16 }} />
      </button>
    </div>
  )
}
