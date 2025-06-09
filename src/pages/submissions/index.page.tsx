import { BookProps } from '@/@types/book'
import useRequest from '@/hooks/useRequest'
import { MainLayout } from '@/layouts/MainLayout'
import { FileText } from 'phosphor-react'
import { BooksContainer, PageContent } from './styles'
import { usePaginationAndSearch } from '@/hooks/usePaginationAndSearchParams'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { Pagination } from '@/components/shared/Pagination'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { ReviewBookCard } from './partials/ReviewBookCard'

export default function Submissions() {
  const { currentPage, setCurrentPage, perPage } = usePaginationAndSearch({
    perPage: 10,
  })

  const {
    data: books,
    isValidating,
    mutate,
  } = useRequest<{
    pendingBooks: BookProps[] | null
    pagination: {
      page: number
      perPage: number
      total: number
      totalPages: number
    }
  }>({
    url: '/books/submitted',
    method: 'GET',
  })

  const renderBookCards = () => {
    if (isValidating) {
      return Array.from({ length: perPage }).map((_, index) => (
        <SkeletonBookCard key={index} />
      ))
    }

    if (!books?.pendingBooks?.length) {
      return <EmptyContainer content="books" />
    }

    return books.pendingBooks.map((book) => (
      <ReviewBookCard
        key={book.id}
        book={book}
        onUpdateBook={async () => {
          mutate()
        }}
        mutate={mutate}
      />
    ))
  }

  return (
    <MainLayout
      title="Submissions | Book Nest"
      icon={<FileText />}
      pageTitle="Submissions"
    >
      <PageContent>
        <BooksContainer
          className={`${
            !books?.pendingBooks?.length && !isValidating ? 'empty' : ''
          }`}
        >
          {renderBookCards()}
        </BooksContainer>

        {books?.pagination?.totalPages && books.pagination.totalPages > 1 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={books.pagination.totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        ) : null}
      </PageContent>
    </MainLayout>
  )
}
