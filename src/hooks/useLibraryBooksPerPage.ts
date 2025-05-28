/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'

const gridBreakpoints: [number, number][] = [
  [1800, 7],
  [1430, 6],
  [1270, 5],
  [1200, 4],
  [1180, 7],
  [1070, 6],
  [880, 5],
  [770, 4],
  [640, 5],
  [530, 4],
  [380, 3],
  [0, 1], // fallback
]

function getColumnsForWidth(width: number): number {
  for (const [breakpoint, columns] of gridBreakpoints) {
    if (width >= breakpoint) return columns
  }
  return 1
}

export function usePerPage(): number {
  const [perPage, setPerPage] = useState(12)

  useEffect(() => {
    const handleResize = debounce(() => {
      if (typeof window === 'undefined') return

      const width = window.innerWidth
      const columns = getColumnsForWidth(width)

      const visibleRows = 2
      const newPerPage = columns * visibleRows

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
