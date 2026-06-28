/* eslint-disable react-hooks/exhaustive-deps */
import { LibraryBookCard } from './LibraryBookCard'
import { OutlineButton } from '@/components/ui/OutlineButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Pagination } from '@/components/shared/Pagination'
import { useEffect, useRef, useState } from 'react'
import { BookProps } from '@/@types/book'
import { formatStatusForAPI } from '@/utils/formatStatusToAPI'
import { SkeletonLibraryCard } from '@/components/skeletons/SkeletonLibraryCard'
import { SearchBar } from '@/components/shared/SearchBar'
import { usePerPage } from '@/hooks/useLibraryBooksPerPage'
import useRequest from '@/hooks/useRequest'
import { LateralMenu } from '@/components/features/books/LateralMenu'
import { usePaginationAndSearch } from '@/hooks/usePaginationAndSearchParams'
import { ReadingStatusTag } from '@/components/features/books/ReadingStatusTag'
import { BookProvider } from '@/contexts/BookContext'

interface Props {
  userId: string | undefined
  selectedStatus: 'read' | 'reading' | 'wantToRead' | 'didNotFinish'
  selectedLabel: string
  refreshKey: number
  setSelectedStatus: (
    value: 'read' | 'reading' | 'wantToRead' | 'didNotFinish' | null,
  ) => void
  setSelectedLabel: (value: string | null) => void
  onTriggerRefresh: () => void
}

export const BooksGridByStatus = ({
  userId,
  selectedStatus,
  selectedLabel,
  refreshKey,
  setSelectedLabel,
  setSelectedStatus,
  onTriggerRefresh,
}: Props) => {
  const gridRef = useRef<HTMLDivElement>(null)

  const [totalPages, setTotalPages] = useState(1)

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const [filteredBooks, setFilteredBooks] = useState<BookProps[] | []>([])

  const {
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    searchTerm,
    perPage,
  } = usePaginationAndSearch({ perPage: usePerPage() })

  const { data, mutate, isValidating } = useRequest<{
    books: BookProps[]
    pagination: {
      page: number
      perPage: number
      total: number
      totalPages: number
    }
  } | null>(
    {
      url: `library/all_books_by_status`,
      method: 'GET',
      params: {
        ...(searchTerm?.length ? { search: searchTerm } : {}),
        page: currentPage,
        perPage,
        userId,
        status: formatStatusForAPI(selectedStatus),
      },
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)

    if (gridRef.current) {
      const offset = 200
      const top =
        gridRef.current.getBoundingClientRect().top + window.scrollY - offset

      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (data) {
      setFilteredBooks(data.books)
      setTotalPages(data.pagination.totalPages)
    }
  }, [data])

  useEffect(() => {
    mutate()
  }, [refreshKey])

  return (
    <div className="flex w-full max-w-6xl flex-col gap-4">
      {openLateralMenu && selectedBook && (
        <BookProvider
          bookId={selectedBook.id}
          onUpdateBook={async () => {
            await mutate()
            onTriggerRefresh()
          }}
          onUpdateRating={async () => {
            await mutate()
            onTriggerRefresh()
          }}
        >
          <LateralMenu onClose={() => setOpenLateralMenu(false)} />
        </BookProvider>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-semibold text-fg">
          <ReadingStatusTag type="relative" readingStatus={selectedStatus} />
          <span className="text-[0.95rem]">{selectedLabel}</span>
        </div>
        <OutlineButton
          onClick={() => {
            setSelectedStatus(null)
            setSelectedLabel('')
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          Go Back
        </OutlineButton>
      </div>

      <SearchBar
        fullWidth
        placeholder="Search for Author or Title"
        search={search}
        onChange={(e) => {
          setCurrentPage(1)
          setSearch(e.target.value)
        }}
        onClick={() => {
          setCurrentPage(1)
          setSearch('')
        }}
      />

      <div className="flex flex-col gap-4">
        <div
          ref={gridRef}
          className="grid w-full gap-2.5 rounded-card bg-s1 p-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(5.5rem, 1fr))',
          }}
        >
          {isValidating || !data
            ? Array.from({ length: perPage }).map((_, index) => (
                <SkeletonLibraryCard key={index} />
              ))
            : filteredBooks?.map((book) => (
                <LibraryBookCard
                  key={book.id}
                  book={book}
                  onSelect={() => {
                    setOpenLateralMenu(true)
                    setSelectedBook(book)
                  }}
                />
              ))}
        </div>

        {totalPages > 1 && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-center border-t border-line bg-bg/90 py-3 backdrop-blur-sm md:left-58">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
