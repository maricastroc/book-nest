import { BookProps } from '@/@types/book'
import useRequest from '@/hooks/useRequest'
import { MainLayout } from '@/layouts/MainLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-solid-svg-icons'
import { usePaginationAndSearch } from '@/hooks/usePaginationAndSearchParams'
import { EmptyContainer } from '@/components/ui/EmptyContainer'
import { Pagination } from '@/components/ui/Pagination'
import { SkeletonBookCard } from '@/components/features/books/SkeletonBookCard'
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

  const isEmpty = !books?.pendingBooks?.length && !isValidating

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
      icon={<FontAwesomeIcon icon={faFileLines} />}
      pageTitle="Submissions"
    >
      <div className="bn-scope flex flex-col px-8 pb-12 pt-8 md:px-10">
        <header className="mb-7 border-b border-line pb-7">
          <div className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg3">
            <FontAwesomeIcon icon={faFileLines} style={{ fontSize: 12 }} />
            <span>Admin</span>
          </div>
          <h1 className="font-serif text-[2rem] font-semibold leading-tight tracking-tight text-fg">
            Submissions
          </h1>
          <p className="mt-1 text-[13px] text-fg2">
            Review and approve books submitted by readers.
          </p>
        </header>

        <div
          className={
            isEmpty
              ? 'flex flex-col items-center justify-center'
              : 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-8'
          }
        >
          {renderBookCards()}
        </div>

        {books?.pagination?.totalPages && books.pagination.totalPages > 1 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={books.pagination.totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        ) : null}
      </div>
    </MainLayout>
  )
}
