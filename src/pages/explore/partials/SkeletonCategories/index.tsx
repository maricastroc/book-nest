import { Container } from './styles'
import { Skeleton, useMediaQuery } from '@mui/material'

export function SkeletonCategories() {
  const isSmallScreen = useMediaQuery('(max-width:600px)')
  const isMediumScreen = useMediaQuery(
    '(min-width:601px) and (max-width:900px)',
  )

  const getSkeletonWidth = () => {
    if (isSmallScreen) return '5.5rem'
    if (isMediumScreen) return '7rem'
    return '9rem'
  }

  const getLength = () => {
    if (isSmallScreen) return 3
    if (isMediumScreen) return 6
    return 9
  }

  return (
    <Container>
      {Array.from({ length: getLength() }).map((_, index) => (
        <Skeleton
          key={index}
          width={getSkeletonWidth()}
          height={'2rem'}
          variant="rounded"
          style={{
            backgroundColor: 'rgba(79, 97, 158, 0.3)',
            borderRadius: 20,
          }}
        />
      ))}
    </Container>
  )
}
