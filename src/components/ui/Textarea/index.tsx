import { TextareaHTMLAttributes } from 'react'
import { StyledTextarea, TextareaContainer, StyledLabel } from './styles'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = ({ label, ...props }: TextareaProps) => {
  return (
    <div>
      {label && <StyledLabel>{label}</StyledLabel>}
      <TextareaContainer>
        <StyledTextarea hasLabel={!!label && label?.length > 0} {...props} />
      </TextareaContainer>
    </div>
  )
}
