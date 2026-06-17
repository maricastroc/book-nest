import { Container, Content, Main } from './styles'
import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonLibraryCard() {
  return (
    <Container>
      <Main>
        <SkeletonBox style={{ width: '100%', height: '8rem' }} />
        <Content>
          <SkeletonBox style={{ width: '100%', height: '1rem' }} />
          <SkeletonBox style={{ width: '100%', height: '1rem' }} />
        </Content>
      </Main>
    </Container>
  )
}
