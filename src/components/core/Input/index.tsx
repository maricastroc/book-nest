import { InputHTMLAttributes, useId, useState } from 'react'
import {
  StyledInput,
  InputContainer,
  ToggleButton,
  StyledLabel,
} from './styles'
import { Eye, EyeSlash } from 'phosphor-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  variant?: 'default' | 'secondary'
}

export const Input = ({
  type,
  label,
  variant = 'default',
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const generatedId = useId()
  const inputId = props.id ?? generatedId

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div>
      {label && <StyledLabel htmlFor={inputId}>{label}</StyledLabel>}
      <InputContainer>
        <StyledInput
          id={inputId}
          variant={variant}
          autoComplete={type === 'password' ? 'new-password' : 'nope'}
          name="field"
          type={type === 'password' && showPassword ? 'text' : type}
          {...props}
        />
        {type === 'password' && (
          <ToggleButton
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <Eye size={16} /> : <EyeSlash size={16} />}
          </ToggleButton>
        )}
      </InputContainer>
    </div>
  )
}
