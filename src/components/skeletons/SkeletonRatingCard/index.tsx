import { Container, Content, Header, Main } from './styles'
import { SkeletonBox } from '@/components/ui/Skeleton'

interface SkeletonRatingCardProps {
  withMarginBottom?: boolean
}

export function SkeletonRatingCard({
  withMarginBottom = false,
}: SkeletonRatingCardProps) {
  return (
    <Container className={withMarginBottom ? 'marginBottom' : ''}>
      <Header>
        <SkeletonBox style={{ width: '100%', height: '1rem' }} />
        <SkeletonBox style={{ width: '100%', height: '1rem' }} />
      </Header>
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
