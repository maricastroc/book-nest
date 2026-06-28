import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type IconDefinition } from '@fortawesome/free-solid-svg-icons'

export const formInputClass =
  'w-full rounded-lg border border-line-strong bg-s1 py-3 pl-10 pr-3.5 text-[15px] text-fg outline-none transition-colors placeholder:text-fg3 hover:border-line-strong focus:border-ac/50 focus:bg-s2'

interface FormFieldProps {
  id: string
  label: string
  icon: IconDefinition
  error?: string
  children: ReactNode
}

export function FormField({
  id,
  label,
  icon,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-fg"
      >
        {label}
      </label>
      <div className="relative">
        <FontAwesomeIcon
          icon={icon}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg3"
          style={{ fontSize: 16 }}
        />
        {children}
      </div>
      {error && <p className="mt-1 text-[12px] text-st-reading">{error}</p>}
    </div>
  )
}
