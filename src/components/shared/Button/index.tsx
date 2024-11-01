import { StyledButton } from './styles'
import { ReactNode, ButtonHTMLAttributes } from 'react'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  content: string | undefined
  icon?: ReactNode
}

export const CustomButton = ({
  content,
  icon,
  ...props
}: CustomButtonProps) => {
  return (
    <StyledButton {...props}>
      {icon}
      {content}
    </StyledButton>
  )
}
