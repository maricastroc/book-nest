import React, { ReactNode, FormHTMLAttributes } from 'react'
import { StyledForm } from './styles'

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  isLarger?: boolean
  isProfileScreen?: boolean
}

export const Form = ({
  children,
  isLarger = false,
  isProfileScreen = false,
  ...props
}: Props) => {
  return (
    <StyledForm
      isLarger={isLarger}
      isProfileScreen={isProfileScreen}
      {...props}
      autoComplete="off"
    >
      {children}
    </StyledForm>
  )
}
