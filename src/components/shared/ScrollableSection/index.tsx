import { CaretLeft, CaretRight } from 'phosphor-react'
import { CaretLeftIcon, CaretRightIcon, ScrollContainer } from './styles'
import { ReactNode } from 'react'

interface Props {
  handleScroll: (direction: 'left' | 'right') => void
  children: ReactNode
  showIcons?: boolean
}

export const ScrollableSection = ({
  handleScroll,
  children,
  showIcons = true,
}: Props) => {
  return (
    <ScrollContainer>
      {children}

      {showIcons && (
        <>
          <CaretLeftIcon onClick={() => handleScroll('left')}>
            <CaretLeft size={24} weight="bold" />
          </CaretLeftIcon>
          <CaretRightIcon onClick={() => handleScroll('right')}>
            <CaretRight size={24} weight="bold" />
          </CaretRightIcon>
        </>
      )}
    </ScrollContainer>
  )
}
