import { ButtonHTMLAttributes, ReactNode } from 'react'
import { StyledActionButton } from './styles'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const ActionButton = ({ children, ...props }: Props) => {
  return <StyledActionButton {...props}>{children}</StyledActionButton>
}
