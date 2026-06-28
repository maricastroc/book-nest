import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonBookStatusList() {
  return (
    <div className="mb-2 flex w-full flex-col gap-3 pb-6 lg:mb-12">
      <div className="flex w-full items-center justify-between">
        <SkeletonBox
          style={{ width: '8rem', height: '1.1rem', borderRadius: '6px' }}
        />
        <SkeletonBox
          style={{ width: '4.5rem', height: '1rem', borderRadius: '6px' }}
        />
      </div>
      <div className="flex w-full gap-5 overflow-x-hidden rounded-xl bg-s2 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox
            key={i}
            className="shrink-0 rounded-lg"
            style={{ width: '5.4rem', height: '8.2rem' }}
          />
        ))}
      </div>
    </div>
  )
}
