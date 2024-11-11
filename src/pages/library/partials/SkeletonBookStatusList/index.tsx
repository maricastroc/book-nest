import { Skeleton } from '@mui/material'
import { Container } from './styles'

export function SkeletonBookStatusList() {
  return (
    <Container>
      <Skeleton
        style={{
          width: '100%',
          height: '2rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(79, 97, 158, 0.3)',
        }}
      />
      <Skeleton
        style={{
          width: '100%',
          height: '11rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(79, 97, 158, 0.3)',
          marginTop: '-1.8rem',
        }}
      />
    </Container>
  )
}
