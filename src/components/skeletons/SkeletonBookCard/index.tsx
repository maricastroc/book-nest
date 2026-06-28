import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonBookCard() {
  return (
    <div className="flex min-w-full cursor-not-allowed flex-col items-center justify-center rounded-[--radius-card] bg-[--color-s2] p-8">
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
