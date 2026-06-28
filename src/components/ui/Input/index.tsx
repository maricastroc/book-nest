import { InputHTMLAttributes, useId, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
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

  const inputClass =
    variant === 'secondary'
      ? [
          'w-full rounded-lg border border-line-strong bg-s1 px-3 py-3',
          'text-[0.9375rem] text-fg placeholder:text-fg3',
          'transition-colors focus:border-ac/50 focus:bg-s2 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-40',
        ].join(' ')
      : [
          'w-full border-0 border-b border-line-strong bg-transparent px-1 py-2.5',
          'text-[0.9375rem] text-fg placeholder:text-fg3',
          'focus:border-ac/60 focus:outline-none transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-40',
        ].join(' ')

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-[0.875rem] font-bold text-fg2"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          autoComplete={type === 'password' ? 'new-password' : 'nope'}
          name="field"
          type={type === 'password' && showPassword ? 'text' : type}
          className={inputClass}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 bg-transparent p-1 text-fg3 hover:text-fg"
          >
            {showPassword ? (
              <FontAwesomeIcon icon={faEye} style={{ fontSize: 16 }} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} style={{ fontSize: 16 }} />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
