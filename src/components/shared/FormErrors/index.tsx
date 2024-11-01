import { StyledFormErrors } from './styles'

interface FormErrorsProps {
  error: string | undefined
}

export const FormErrors = ({ error }: FormErrorsProps) => {
  return (
    <StyledFormErrors>
      <span>{error}</span>
    </StyledFormErrors>
  )
}
