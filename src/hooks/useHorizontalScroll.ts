/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect, useState, useCallback } from 'react'

export const useHorizontalScroll = (containerRef: RefObject<HTMLElement>) => {
  const [isOverflowing, setIsOverflowing] = useState(false)

  const checkOverflow = useCallback(() => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current
      console.log('ScrollWidth:', scrollWidth, 'ClientWidth:', clientWidth) // Debug
      setIsOverflowing(scrollWidth > clientWidth)
    }
  }, [containerRef])

  useEffect(() => {
    checkOverflow()
    const timeoutId = setTimeout(checkOverflow, 100)

    window.addEventListener('resize', checkOverflow)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [checkOverflow])

  useEffect(() => {
    if (containerRef.current) {
      checkOverflow()
    }
  }, [containerRef.current, checkOverflow])

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'right' ? 300 : -300
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return { isOverflowing, handleScroll }
}
