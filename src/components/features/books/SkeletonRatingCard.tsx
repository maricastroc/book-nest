import { SkeletonBox } from '@/components/ui/Skeleton'

interface SkeletonRatingCardProps {
  withMarginBottom?: boolean
}

export function SkeletonRatingCard({
  withMarginBottom = false,
}: SkeletonRatingCardProps) {
  return (
    <div
      className={`flex min-w-full cursor-not-allowed flex-col items-center justify-center rounded-[--radius-card] bg-[--color-s2] p-8${
        withMarginBottom ? ' mb-6' : ''
      }`}
    >
      <div className="mb-6 grid w-full grid-cols-[1fr_3fr] gap-4">
        <SkeletonBox style={{ width: '100%', height: '1rem' }} />
        <SkeletonBox style={{ width: '100%', height: '1rem' }} />
      </div>
      <div className="grid w-full grid-cols-2 gap-4">
        <SkeletonBox style={{ width: '100%', height: '8rem' }} />
        <div className="grid w-full grid-rows-2 gap-4">
          <SkeletonBox style={{ width: '100%', height: '100%' }} />
          <SkeletonBox style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  )
}
