import { StyledButton } from './styles'
import { ReactNode, ButtonHTMLAttributes } from 'react'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  content: string | undefined
  icon?: ReactNode
  isSubmitting?: boolean
}

export const CustomButton = ({
  content,
  icon,
  isSubmitting = false,
  ...props
}: CustomButtonProps) => {
  return (
    <StyledButton className={isSubmitting ? 'disabled' : ''} {...props}>
      {icon}
      {isSubmitting ? 'Loading...' : content}
    </StyledButton>
  )
}
