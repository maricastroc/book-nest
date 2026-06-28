import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonUserSidebar() {
  return (
    <div className="flex min-w-full items-center justify-center gap-4">
      <SkeletonBox
        variant="circular"
        style={{ width: '3rem', height: '2.5rem' }}
      />
      <SkeletonBox style={{ width: '70%', height: '1.5rem' }} />
    </div>
  )
}
