import { HTMLAttributes } from 'react'

interface SkeletonBoxProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'rounded' | 'circular'
}

export function SkeletonBox({
  variant = 'rounded',
  className,
  style,
  ...props
}: SkeletonBoxProps) {
  const shape = variant === 'circular' ? 'rounded-full' : 'rounded'
  return (
    <div
      className={`animate-pulse bg-[rgba(255,255,255,0.13)] ${shape}${
        className ? ` ${className}` : ''
      }`}
      style={style}
      {...props}
    />
  )
}
