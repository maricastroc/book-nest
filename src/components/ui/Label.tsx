import { LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  content: string
}

export const Label = ({ content, ...props }: LabelProps) => {
  return (
    <label
      className="ml-1 block text-[0.875rem] font-bold text-fg2 transition-colors"
      {...props}
    >
      {content}
    </label>
  )
}
