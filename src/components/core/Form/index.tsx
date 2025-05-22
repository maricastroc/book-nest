import React, { ReactNode, FormHTMLAttributes } from 'react'
import { StyledForm } from './styles'

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  isLarger?: boolean
  hasGap?: boolean
}

export const Form = ({
  children,
  isLarger = false,
  hasGap = false,
  ...props
}: Props) => {
  return (
    <StyledForm
      isLarger={isLarger}
      hasGap={hasGap}
      {...props}
      autoComplete="off"
    >
      {children}
    </StyledForm>
  )
}
