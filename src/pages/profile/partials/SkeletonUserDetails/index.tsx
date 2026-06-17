import { Container, Header, Main, MainItem } from './styles'
import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonUserDetails() {
  return (
    <Container>
      <Header>
        <SkeletonBox
          variant="circular"
          style={{ width: '100%', height: '5rem' }}
        />
        <SkeletonBox style={{ width: '100%', height: '1rem' }} />
      </Header>
      <Main>
        {[...Array(4)].map((_, i) => (
          <MainItem key={i}>
            <SkeletonBox style={{ width: '30%', height: '2rem' }} />
            <SkeletonBox style={{ width: '70%', height: '2rem' }} />
          </MainItem>
        ))}
      </Main>
    </Container>
  )
}
