import { useEffect, useState, useRef } from 'react'
import { BookProps } from '@/@types/book'
import { CategoryProps } from '@/@types/category'
import useRequest from '@/hooks/useRequest'
import { usePerPage } from '@/hooks/useExploreBooksPerPage'
import { usePaginationAndSearch } from './usePaginationAndSearchParams'

export type ExploreSort =
  | 'title-asc'
  | 'title-desc'
  | 'newest'
  | 'rating'
  | 'most-rated'

export function useExploreBooks() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [sort, setSort] = useState<ExploreSort>('title-asc')

  const [totalPages, setTotalPages] = useState(1)

  const [totalBooks, setTotalBooks] = useState(0)

  const [updatedBooks, setUpdatedBooks] = useState<BookProps[]>([])

  const gridRef = useRef<HTMLDivElement>(null)

  const {
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    searchTerm,
    perPage,
  } = usePaginationAndSearch({ perPage: usePerPage() })

  const {
    data: booksData,
    isValidating,
    error,
  } = useRequest<{
    books: BookProps[]
    pagination: {
      page: number
      perPage: number
      total: number
      totalPages: number
    }
  } | null>(
    {
      url: '/books',
      method: 'GET',
      params: {
        category: selectedCategory,
        ...(searchTerm ? { search: searchTerm } : {}),
        sort,
        page: currentPage,
        perPage,
      },
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 20000,
      focusThrottleInterval: 30000,
      keepPreviousData: true,
    },
  )

  const { data: categories } = useRequest<CategoryProps[] | null>({
    url: '/categories',
    method: 'GET',
  })

  const onUpdateBook = (updatedBook: BookProps) => {
    setUpdatedBooks((prevBooks) => {
      if (!prevBooks) return prevBooks

      const updatedBooks = prevBooks.map((book) =>
        book.id === updatedBook.id ? updatedBook : book,
      )

      return updatedBooks
    })
  }

  useEffect(() => {
    if (booksData?.pagination) {
      setTotalPages(booksData.pagination.totalPages)
      setTotalBooks(booksData.pagination.total)
    }
    if (booksData?.books) {
      setUpdatedBooks(booksData.books)
    }
  }, [booksData])

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage])

  return {
    search,
    setSearch,
    searchTerm,
    selectedCategory,
    setSelectedCategory,
    sort,
    setSort,
    currentPage,
    setCurrentPage,
    totalPages,
    totalBooks,
    updatedBooks,
    onUpdateBook,
    categories,
    isValidating,
    error,
    gridRef,
    perPage,
  }
}
