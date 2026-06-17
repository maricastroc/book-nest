import { LabelHTMLAttributes } from 'react'
import { StyledLabel } from './styles'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  content: string
}

export const Label = ({ content }: LabelProps) => {
  return <StyledLabel>{content}</StyledLabel>
}
