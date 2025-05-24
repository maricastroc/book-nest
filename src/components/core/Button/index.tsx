import { StyledButton } from './styles'
import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  content: string | undefined
  isSmaller?: boolean
  isSubmitting?: boolean
  variant?: 'default' | 'outline-white' | 'solid-white'
}

export const Button = ({
  content,
  isSubmitting = false,
  isSmaller = false,
  variant = 'default',
  ...props
}: Props) => {
  return (
    <StyledButton
      disabled={isSubmitting}
      className={isSmaller ? 'smaller' : ''}
      variant={variant}
      {...props}
    >
      {isSubmitting ? 'Loading...' : content}
    </StyledButton>
  )
}
