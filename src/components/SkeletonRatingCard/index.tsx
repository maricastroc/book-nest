import { Container, Content, Header, Main } from './styles'
import { Skeleton } from '@mui/material'

interface SkeletonRatingCardProps {
  withMarginBottom?: boolean
}

export function SkeletonRatingCard({
  withMarginBottom = false,
}: SkeletonRatingCardProps) {
  return (
    <Container className={withMarginBottom ? 'marginBottom' : ''}>
      <Header>
        <Skeleton
          width={'100%'}
          height={'1rem'}
          variant="rounded"
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
        <Skeleton
          width={'100%'}
          height={'8rem'}
          variant="rounded"
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
