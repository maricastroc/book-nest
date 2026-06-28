import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonUserDetails() {
  return (
    <div className="flex w-full max-w-sm cursor-not-allowed flex-col overflow-hidden rounded-feature border border-line bg-s1">
      {/* Header zone */}
      <div className="flex flex-col items-center gap-3 px-6 pt-7">
        <SkeletonBox
          variant="circular"
          style={{ width: '5rem', height: '5rem' }}
        />
        <SkeletonBox style={{ width: '8rem', height: '1.1rem' }} />
        <SkeletonBox style={{ width: '6rem', height: '0.8rem' }} />
        <SkeletonBox style={{ width: '100%', height: '2.2rem' }} />
      </div>

      {/* Donut zone */}
      <div className="mt-6 flex flex-col items-center gap-5 border-t border-line px-6 py-6">
        <SkeletonBox
          variant="circular"
          style={{ width: '9rem', height: '9rem' }}
        />
        <div className="grid w-full grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <SkeletonBox key={i} style={{ width: '100%', height: '1rem' }} />
          ))}
        </div>
      </div>

      {/* Metrics zone */}
      <div className="flex flex-col gap-3 border-t border-line px-6 py-5">
        {[...Array(4)].map((_, i) => (
          <SkeletonBox key={i} style={{ width: '100%', height: '1.4rem' }} />
        ))}
      </div>
    </div>
  )
}
