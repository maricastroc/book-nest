/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'

export function usePerPage(): number {
  const [perPage, setPerPage] = useState(15)

  useEffect(() => {
    const handleResize = debounce(() => {
      if (typeof window === 'undefined') return

      const width = window.innerWidth
      let newPerPage = 15

      if (width < 768) newPerPage = 12
      else if (width < 1200) newPerPage = 12
      else if (width > 1400) newPerPage = 18

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
