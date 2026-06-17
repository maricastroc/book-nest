import { StyledOutlineButton } from './styles'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const OutlineButton = ({ children, ...props }: Props) => {
  return <StyledOutlineButton {...props}>{children}</StyledOutlineButton>
}
