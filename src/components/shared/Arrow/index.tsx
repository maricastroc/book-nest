import { CaretLeft, CaretRight } from 'phosphor-react'
import React from 'react'

interface ArrowProps {
  disabled?: boolean
  left?: boolean
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void
}

export function Arrow({ disabled, left, onClick }: ArrowProps) {
  const disabledClass = disabled ? ' arrow--disabled' : ''
  const Icon = left ? CaretLeft : CaretRight

  return (
    <Icon
      onClick={onClick}
      className={`arrow ${
        left ? 'arrow--left' : 'arrow--right'
      } ${disabledClass}`}
      size={22}
    />
  )
}
