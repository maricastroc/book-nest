import { Container } from './styles'
import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonUserSidebar() {
  return (
    <Container>
      <SkeletonBox
        variant="circular"
        style={{ width: '3rem', height: '2.5rem' }}
      />
      <SkeletonBox style={{ width: '70%', height: '1.5rem' }} />
    </Container>
  )
}
