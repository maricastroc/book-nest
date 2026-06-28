import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonLibraryCard() {
  return (
    <div className="flex min-w-full cursor-not-allowed flex-col items-center justify-center rounded-[--radius-card] p-2">
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
