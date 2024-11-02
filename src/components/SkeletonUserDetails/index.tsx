import { Container, Header, Main } from './styles'
import { Skeleton } from '@mui/material'

export function SkeletonUserDetails() {
  return (
    <Container>
      <Header>
        <Skeleton
          width={'100%'}
          height={'5rem'}
          variant="circular"
          style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
        />
      </Header>

      <Main>
        <Skeleton
          width={'100%'}
          height={'2rem'}
          variant="rounded"
          style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
        />
        <Skeleton
          width={'100%'}
          height={'2rem'}
          variant="rounded"
          style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
        />
        <Skeleton
          width={'100%'}
          height={'2rem'}
          variant="rounded"
          style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
        />
        <Skeleton
          width={'100%'}
          height={'2rem'}
          variant="rounded"
          style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
        />
      </Main>
    </Container>
  )
}
