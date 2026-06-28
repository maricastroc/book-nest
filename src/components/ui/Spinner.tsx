interface SpinnerProps {
  size?: 'sm' | 'md'
}

export const Spinner = ({ size = 'md' }: SpinnerProps) => {
  const dim = size === 'sm' ? 'h-6 w-6' : 'h-12 w-12'
  return (
    <div
      className={`${dim} animate-spin rounded-full border-[3px] border-line-strong border-t-ac`}
    />
  )
}
