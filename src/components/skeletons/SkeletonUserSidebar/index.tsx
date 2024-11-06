import { Container } from './styles'

import { Skeleton } from '@mui/material'

export function SkeletonUserSidebar() {
  return (
    <Container>
      <Skeleton
        width={'3rem'}
        height={'2.5rem'}
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
