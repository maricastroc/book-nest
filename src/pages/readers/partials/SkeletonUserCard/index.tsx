import { Container, Content, Main } from './styles'
import { Skeleton } from '@mui/material'

export function SkeletonUserCard() {
  return (
    <Container>
      <Main>
        <Skeleton
          width={'5.5rem'}
          height={'4rem'}
          variant="circular"
          style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
        />
        <Content>
          <Skeleton
            width={'100%'}
            height={'100%'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
          <Skeleton
            width={'100%'}
            height={'100%'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
        </Content>
      </Main>
    </Container>
  )
}
