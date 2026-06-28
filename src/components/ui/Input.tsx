import { forwardRef, InputHTMLAttributes, useId, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: IconDefinition
  error?: string
  variant?: 'default' | 'secondary'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type, label, icon, error, variant = 'default', ...props },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false)
  const generatedId = useId()
  const inputId = props.id ?? generatedId
  const isPassword = type === 'password'
  const hasIcon = variant === 'default' && !!icon

  const inputClass =
    variant === 'secondary'
      ? [
          'w-full rounded-lg border border-line-strong bg-s1 px-3 py-3',
          'text-[0.9375rem] text-fg placeholder:text-fg3',
          'transition-colors focus:border-ac/50 focus:bg-s2 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-40',
          isPassword ? 'pr-10' : '',
        ].join(' ')
      : [
          'w-full rounded-lg border border-line-strong bg-s1 py-3 text-[15px] text-fg',
          'outline-none transition-colors placeholder:text-fg3',
          'hover:border-line-strong focus:border-ac/50 focus:bg-s2',
          'disabled:cursor-not-allowed disabled:opacity-40',
          hasIcon ? 'pl-10' : 'pl-3.5',
          isPassword ? 'pr-10' : 'pr-3.5',
        ].join(' ')

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className={
            variant === 'secondary'
              ? 'mb-1 block text-[0.875rem] font-bold text-fg2'
              : 'mb-1.5 block text-[13px] font-medium text-fg'
          }
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {hasIcon && (
          <FontAwesomeIcon
            icon={icon}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg3"
            style={{ fontSize: 16 }}
          />
        )}
        <input
          ref={ref}
          id={inputId}
          autoComplete={isPassword ? 'new-password' : 'nope'}
          name="field"
          type={isPassword && showPassword ? 'text' : type}
          className={inputClass}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 bg-transparent p-1 text-fg3 hover:text-fg"
          >
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              style={{ fontSize: 16 }}
            />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-[12px] text-st-reading">{error}</p>}
    </div>
  )
})
