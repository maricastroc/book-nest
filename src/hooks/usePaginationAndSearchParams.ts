import { useState, useEffect } from 'react'
import { useDebouncedValue } from '@/hooks/useDebounce'

export function usePaginationAndSearch({ perPage = 10, initialSearch = '' }) {
  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState(initialSearch)

  const searchTerm = useDebouncedValue(search)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return {
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    searchTerm,
    perPage,
  }
}
