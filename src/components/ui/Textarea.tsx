import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = ({ label, ...props }: TextareaProps) => {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-[0.875rem] font-bold text-fg2">
          {label}
        </label>
      )}
      <div className="relative flex w-full">
        <textarea
          className={[
            'w-full resize-vertical rounded-lg border border-line-strong bg-s1',
            'px-3 font-[inherit] text-[0.85rem] leading-[1.7] text-fg placeholder:text-fg3',
            label ? 'py-2' : 'py-3',
            'min-h-24 transition-colors',
            'focus:border-ac/50 focus:bg-s2 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-40',
          ].join(' ')}
          {...props}
        />
      </div>
    </div>
  )
}
