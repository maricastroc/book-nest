import { CaretLeft, CaretRight } from 'phosphor-react'
import { PaginationButton, PaginationContainer, PaginationPage } from './styles'

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
    <PaginationContainer>
      <PaginationButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <CaretLeft size={20} weight="bold" />
      </PaginationButton>

      {pages.map((page) => (
        <PaginationPage
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PaginationPage>
      ))}

      <PaginationButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <CaretRight size={20} weight="bold" />
      </PaginationButton>
    </PaginationContainer>
  )
}
