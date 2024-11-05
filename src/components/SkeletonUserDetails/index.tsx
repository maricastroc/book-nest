import { Container, Header, Main, MainItem } from './styles'
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
        <Skeleton
          width={'100%'}
          height={'1rem'}
          variant="rounded"
          style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
        />
      </Header>
      <Main>
        <MainItem>
          <Skeleton
            width={'30%'}
            height={'2rem'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
          <Skeleton
            width={'70%'}
            height={'2rem'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
        </MainItem>
        <MainItem>
          <Skeleton
            width={'30%'}
            height={'2rem'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
          <Skeleton
            width={'70%'}
            height={'2rem'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
        </MainItem>
        <MainItem>
          <Skeleton
            width={'30%'}
            height={'2rem'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
          <Skeleton
            width={'70%'}
            height={'2rem'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
        </MainItem>
        <MainItem>
          <Skeleton
            width={'30%'}
            height={'2rem'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
          <Skeleton
            width={'70%'}
            height={'2rem'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
        </MainItem>
      </Main>
    </Container>
  )
}
