import { Container, Content, Main } from './styles'
import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonUserCard() {
  return (
    <Container>
      <Main>
        <SkeletonBox
          variant="circular"
          style={{ width: '5.5rem', height: '4rem' }}
        />
        <Content>
          <SkeletonBox style={{ width: '100%', height: '100%' }} />
          <SkeletonBox style={{ width: '100%', height: '100%' }} />
        </Content>
      </Main>
    </Container>
  )
}
