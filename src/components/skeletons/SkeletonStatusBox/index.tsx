import { Skeleton } from '@mui/material'

interface SkeletonStatusBoxProps {
  count?: number
}

export function SkeletonStatusBox({ count = 1 }: SkeletonStatusBoxProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          style={{
            width: '100%',
            height: '10rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(79, 97, 158, 0.3)',
          }}
        />
      ))}
    </>
  )
}
