import { useEffect, useState, useRef } from 'react'
import { BookProps } from '@/@types/book'
import { CategoryProps } from '@/@types/category'
import useRequest from '@/hooks/useRequest'
import { usePerPage } from '@/hooks/useExploreBooksPerPage'
import { useDebouncedValue } from './useDebounce'

export function useExploreBooks() {
  const [search, setSearch] = useState('')

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)

  const [totalPages, setTotalPages] = useState(1)

  const [updatedBooks, setUpdatedBooks] = useState<BookProps[]>([])

  const perPage = usePerPage()

  const containerRef = useRef<HTMLDivElement>(null)

  const gridRef = useRef<HTMLDivElement>(null)

  const searchTerm = useDebouncedValue(search)

  const { data: booksData, isValidating } = useRequest<{
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
        page: currentPage,
        perPage,
      },
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
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
    currentPage,
    setCurrentPage,
    totalPages,
    updatedBooks,
    onUpdateBook,
    categories,
    isValidating,
    containerRef,
    gridRef,
    perPage,
  }
}
