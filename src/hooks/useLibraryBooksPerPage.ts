/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'

export function useLibraryBooksPerPage(): number {
  const [perPage, setPerPage] = useState(12)

  useEffect(() => {
    const handleResize = debounce(() => {
      if (typeof window === 'undefined') return

      const width = window.innerWidth
      let newPerPage = 12

      if (width < 640) newPerPage = 8 // mobile
      else if (width < 768) newPerPage = 10 // tablet pequeno
      else if (width < 1024) newPerPage = 12 // tablet
      else if (width < 1280) newPerPage = 12 // laptop
      else newPerPage = 12 // desktop grande

      setPerPage(newPerPage)
    }, 100)

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      handleResize.cancel?.()
    }
  }, [])

  return perPage
}

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: NodeJS.Timeout

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }

  debounced.cancel = () => clearTimeout(timeoutId)

  return debounced
}
