import { SkeletonBox } from '@/components/ui/Skeleton'
import { useScreenSize } from '@/hooks/useScreenSize'

export function SkeletonCategories() {
  const isSmallScreen = useScreenSize(600)
  const isMediumScreen = useScreenSize(900)

  const skeletonWidth = isSmallScreen
    ? '5.5rem'
    : isMediumScreen
    ? '7rem'
    : '9rem'
  const length = isSmallScreen ? 3 : isMediumScreen ? 6 : 12

  return (
    <div className="flex min-w-full items-center justify-center gap-2 overflow-x-auto rounded-lg sm:justify-start">
      {Array.from({ length }).map((_, index) => (
        <SkeletonBox
          key={index}
          style={{ width: skeletonWidth, height: '2rem', borderRadius: '20px' }}
        />
      ))}
    </div>
  )
}
