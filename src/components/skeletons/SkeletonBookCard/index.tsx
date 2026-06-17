import { Container, Content, Main } from './styles'
import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonBookCard() {
  return (
    <Container>
      <Main>
        <SkeletonBox style={{ width: '100%', height: '8rem' }} />
        <Content>
          <SkeletonBox style={{ width: '100%', height: '100%' }} />
          <SkeletonBox style={{ width: '100%', height: '100%' }} />
        </Content>
      </Main>
    </Container>
  )
}
