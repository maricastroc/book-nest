import React, { ReactNode, FormHTMLAttributes } from 'react'

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  isLarger?: boolean
  isProfileScreen?: boolean
}

export const Form = ({
  children,
  isLarger = false,
  isProfileScreen = false,
  className = '',
  ...props
}: Props) => {
  return (
    <form
      autoComplete="off"
      className={[
        'flex flex-col gap-5',
        isLarger ? 'w-full max-w-[29rem]' : 'w-full',
        isProfileScreen ? 'w-auto' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </form>
  )
}
