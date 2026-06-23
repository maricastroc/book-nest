import { styled } from '@/styles'
import { SkeletonBox } from '@/components/ui/Skeleton'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.7rem',
  width: '100%',
  paddingBottom: '1.5rem',
  marginBottom: '0.5rem',

  '@media (min-width: 1024px)': {
    marginBottom: '3rem',
  },
})

export const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
})

export const BooksRow = styled('div', {
  display: 'flex',
  gap: '1.2rem',
  overflowX: 'hidden',
  padding: '1.5rem',
  background: '$gray700',
  borderRadius: 8,
  width: '100%',
})

export const BookCoverSkeleton = styled(SkeletonBox, {
  flexShrink: 0,
  width: '5.4rem',
  height: '8.2rem',
  borderRadius: 8,
})
