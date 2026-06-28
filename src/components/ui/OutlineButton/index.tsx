import { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const OutlineButton = ({ children, ...props }: Props) => {
  return (
    <button
      {...props}
      className={[
        'flex items-center gap-1.5 rounded-[10px] border border-line-strong px-4 py-2',
        'text-[13px] font-medium text-fg2 transition-colors',
        'hover:bg-s2 hover:text-fg',
        props.className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
