import { SkeletonBox } from '@/components/ui/Skeleton'
import { Container } from './styles'

export function SkeletonBookStatusList() {
  return (
    <Container>
      <SkeletonBox
        style={{ width: '100%', height: '2rem', borderRadius: '8px' }}
      />
      <SkeletonBox
        style={{
          width: '100%',
          height: '11rem',
          borderRadius: '8px',
          marginTop: '-1.8rem',
        }}
      />
    </Container>
  )
}
