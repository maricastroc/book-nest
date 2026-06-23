import { CaretLeft, CaretRight } from 'phosphor-react'
import { useRef, useState, ReactNode } from 'react'
import { ArrowButton, ScrollTrack, Wrapper } from './styles'

interface HorizontalScrollProps {
  children: ReactNode
  scrollAmount?: number
  itemWidth?: string
}

export function HorizontalScroll({
  children,
  scrollAmount = 340,
  itemWidth,
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

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <Wrapper>
      <ArrowButton
        side="left"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
      >
        <CaretLeft />
      </ArrowButton>

      <ScrollTrack
        ref={scrollRef}
        onScroll={updateButtons}
        css={itemWidth ? { '& > *': { flexShrink: 0, width: itemWidth } } : {}}
      >
        {children}
      </ScrollTrack>

      <ArrowButton
        side="right"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
      >
        <CaretRight />
      </ArrowButton>
    </Wrapper>
  )
}
