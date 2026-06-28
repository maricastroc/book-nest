import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonBookCard() {
  return (
    <div className="flex w-full cursor-not-allowed items-stretch gap-3 rounded-[10px] border border-line bg-s1 p-3 sm:gap-4 sm:p-4">
      <SkeletonBox
        className="w-18 shrink-0 self-start sm:w-21"
        style={{ height: '8rem' }}
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex flex-col gap-1.5">
          <SkeletonBox style={{ width: '100%', height: '0.85rem' }} />
          <SkeletonBox style={{ width: '65%', height: '0.85rem' }} />
          <SkeletonBox
            className="mt-1"
            style={{ width: '40%', height: '0.7rem' }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <SkeletonBox style={{ width: '30%', height: '0.65rem' }} />
          <SkeletonBox style={{ width: '5rem', height: '0.8rem' }} />
        </div>
      </div>
    </div>
  )
}
