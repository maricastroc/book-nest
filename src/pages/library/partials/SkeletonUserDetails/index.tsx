import { Container } from './styles'
import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonUserDetails() {
  return (
    <Container>
      <SkeletonBox
        variant="circular"
        style={{ width: '4rem', height: '4rem' }}
      />
      <SkeletonBox style={{ width: '70%', height: '1.5rem' }} />
    </Container>
  )
}
