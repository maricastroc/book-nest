import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonUserDetails() {
  return (
    <div className="mb-8 flex min-w-full flex-col items-center justify-center gap-4">
      <SkeletonBox
        variant="circular"
        style={{ width: '4rem', height: '4rem' }}
      />
      <SkeletonBox style={{ width: '70%', height: '1.5rem' }} />
    </div>
  )
}
