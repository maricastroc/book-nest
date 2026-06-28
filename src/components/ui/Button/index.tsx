import { ButtonHTMLAttributes } from 'react'

const variantClasses: Record<string, string> = {
  default:
    'bg-ac text-ac-ink hover:bg-ac/90 border border-transparent disabled:opacity-40 disabled:cursor-not-allowed',
  'outline-white':
    'bg-transparent text-fg border border-line hover:bg-white/[0.05] hover:border-line-strong disabled:opacity-40 disabled:cursor-not-allowed',
  'solid-white':
    'bg-fg text-bg border border-transparent hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed',
  secondary:
    'bg-s2 text-fg2 border border-line hover:text-fg hover:border-line-strong disabled:opacity-40 disabled:cursor-not-allowed',
  delete:
    'bg-[--color-st-reading] text-white border border-transparent hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  content: string | undefined
  isSmaller?: boolean
  isSubmitting?: boolean
  variant?: 'default' | 'outline-white' | 'solid-white' | 'delete' | 'secondary'
}

export const Button = ({
  content,
  isSubmitting = false,
  isSmaller = false,
  variant = 'default',
  className,
  ...props
}: Props) => {
  const sizeClasses = isSmaller
    ? 'px-3 py-1.5 text-[0.85rem]'
    : 'px-4 py-3.5 text-[0.9375rem]'

  return (
    <button
      disabled={isSubmitting}
      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg transition-all ${sizeClasses} ${
        variantClasses[variant]
      } ${className ?? ''}`}
      {...props}
    >
      {isSubmitting ? 'Loading...' : content}
    </button>
  )
}
