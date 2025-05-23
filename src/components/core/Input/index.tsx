import { InputHTMLAttributes, useState } from 'react'
import {
  StyledInput,
  InputContainer,
  ToggleButton,
  StyledLabel,
} from './styles'
import { Eye, EyeSlash } from 'phosphor-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = ({ type, label, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div>
      {label && <StyledLabel>{label}</StyledLabel>}
      <InputContainer>
        <StyledInput
          hasLabel={!!label && label?.length > 0}
          autoComplete={type === 'password' ? 'new-password' : 'nope'}
          name="field"
          type={type === 'password' && showPassword ? 'text' : type}
          {...props}
        />
        {type === 'password' && (
          <ToggleButton type="button" onClick={togglePasswordVisibility}>
            {showPassword ? <Eye size={16} /> : <EyeSlash size={16} />}
          </ToggleButton>
        )}
      </InputContainer>
    </div>
  )
}
