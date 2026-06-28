import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonExploreCard() {
  return (
    <div className="flex min-w-full cursor-not-allowed flex-col items-center justify-center rounded-[--radius-card] bg-[--color-s2] p-5 lg:p-6">
      <div className="flex min-w-full flex-col gap-4">
        <SkeletonBox style={{ width: '100%', height: '8rem' }} />
        <div className="flex w-full flex-col gap-4">
          <SkeletonBox style={{ width: '100%', height: '1rem' }} />
          <SkeletonBox style={{ width: '100%', height: '1rem' }} />
        </div>
      </div>
    </div>
  )
}
