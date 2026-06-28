import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { useRef, useState, ReactNode } from 'react'

interface HorizontalScrollProps {
  children: ReactNode
  scrollAmount?: number
  itemWidth?: string
  fadeColor?: string
}

export function HorizontalScroll({
  children,
  scrollAmount = 340,
  fadeColor = 'var(--color-bg)',
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateButtons = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    })
  }

  const fadeBase: React.CSSProperties = {
    background: `linear-gradient(to right, ${fadeColor}, transparent)`,
  }
  const fadeRight: React.CSSProperties = {
    background: `linear-gradient(to left, ${fadeColor}, transparent)`,
  }

  return (
    <div className="bn-scope relative w-full">
      {canScrollLeft && (
        <>
          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16"
            style={fadeBase}
          />
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-el/90 text-fg2 shadow-lg backdrop-blur-sm transition-colors hover:bg-el hover:text-fg"
          >
            <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 12 }} />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        onScroll={updateButtons}
        className="flex w-full flex-row items-start gap-4 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {canScrollRight && (
        <>
          <div
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20"
            style={fadeRight}
          />
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-el/90 text-fg2 shadow-lg backdrop-blur-sm transition-colors hover:bg-el hover:text-fg"
          >
            <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 12 }} />
          </button>
        </>
      )}
    </div>
  )
}
