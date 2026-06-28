import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonLateralMenu() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex w-full flex-col items-center justify-center gap-6 rounded-[--radius-card] bg-[--color-s2] p-8">
        <div className="flex w-full flex-col items-center justify-center gap-6 sm:grid sm:grid-cols-[1fr_1.5fr]">
          <div className="h-auto w-1/2 max-w-[10rem] sm:w-full">
            <SkeletonBox style={{ width: '100%', height: '13rem' }} />
          </div>
          <div className="flex h-full w-full flex-col justify-between">
            <div className="mb-6 flex w-full flex-col gap-6">
              {[...Array(2)].map((_, i) => (
                <SkeletonBox
                  key={i}
                  style={{ width: '100%', height: '2rem' }}
                />
              ))}
            </div>
            <SkeletonBox style={{ width: '100%', height: '6rem' }} />
          </div>
        </div>
        <div className="w-full">
          <SkeletonBox style={{ width: '100%', height: '6rem' }} />
        </div>
      </div>

      {[...Array(4)].map((_, i) => (
        <SkeletonRatingCard key={i} />
      ))}
    </div>
  )
}
