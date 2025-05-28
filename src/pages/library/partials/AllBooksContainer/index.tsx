import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LibraryBookCard } from '../LibraryBookCard'
import {
  AllBooksMainContainer,
  AllBooksContent,
  AllBooksWrapper,
  Header,
  TagStatus,
} from './styles'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { OutlineButton } from '@/components/core/OutlineButton'
import { CaretLeft } from 'phosphor-react'
import { Pagination } from '@/components/shared/Pagination'
import { useEffect, useRef, useState } from 'react'
import { BookProps } from '@/@types/book'
import { formatStatusForAPI } from '@/utils/formatStatusToAPI'
import { SkeletonLibraryCard } from '@/components/skeletons/SkeletonLibraryCard'
import { SearchBar } from '@/components/shared/SearchBar'
import { usePerPage } from '@/hooks/useLibraryBooksPerPage'
import useRequest from '@/hooks/useRequest'
import { LateralMenu } from '@/components/shared/LateralMenu'

interface Props {
  userId: string | undefined
  selectedStatus: 'read' | 'reading' | 'want_to_read' | 'did_not_finish'
  selectedLabel: string
  setSelectedStatus: (
    value: 'read' | 'reading' | 'want_to_read' | 'did_not_finish' | null,
  ) => void
  setSelectedLabel: (value: string | null) => void
}

export const AllBooksContainer = ({
  userId,
  selectedStatus,
  selectedLabel,
  setSelectedLabel,
  setSelectedStatus,
}: Props) => {
  const gridRef = useRef<HTMLDivElement>(null)

  const perPage = usePerPage()

  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState('')

  const [searchTerm, setSearchTerm] = useState('')

  const [totalPages, setTotalPages] = useState(1)

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const [filteredBooks, setFilteredBooks] = useState<BookProps[] | []>([])

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (data) {
      setFilteredBooks(data.books)
      setTotalPages(data.pagination.totalPages)
    }
  }, [data])

  return (
    <AllBooksWrapper>
      {openLateralMenu && selectedBook && (
        <LateralMenu
          bookId={selectedBook.id}
          onUpdateBook={() => {
            mutate()
          }}
          onClose={() => setOpenLateralMenu(false)}
        />
      )}
      <Header>
        <TagStatus className={selectedStatus}>
          <FontAwesomeIcon icon={faBookmark} />
          {selectedLabel}
        </TagStatus>

        <OutlineButton
          onClick={() => {
            setSelectedStatus(null)
            setSelectedLabel('')
          }}
        >
          <CaretLeft />
          Go Back
        </OutlineButton>
      </Header>
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
      <AllBooksMainContainer>
        <AllBooksContent ref={gridRef}>
          {isValidating || !data
            ? Array.from({ length: perPage }).map((_, index) => (
                <SkeletonLibraryCard key={index} />
              ))
            : filteredBooks?.map((book) => {
                return (
                  <LibraryBookCard
                    key={book.id}
                    book={book}
                    onSelect={() => {
                      setOpenLateralMenu(true)
                      setSelectedBook(book)
                    }}
                  />
                )
              })}
        </AllBooksContent>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </AllBooksMainContainer>
    </AllBooksWrapper>
  )
}
