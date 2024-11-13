import { Container } from './styles'

import { Skeleton } from '@mui/material'

export function SkeletonUserDetails() {
  return (
    <Container>
      <Skeleton
        width={'4rem'}
        height={'4rem'}
        variant="circular"
        style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
      />
      <Skeleton
        width={'70%'}
        height={'1.5rem'}
        variant="rounded"
        style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
      />
    </Container>
  )
}
