import { styled } from '@/styles'

export const BookStatusListWrapper = styled('div', {
  alignItems: 'flex-start',
  width: '100%',
  gap: '2rem',

  '@media (min-width: 1200px)': {
    padding: '0 1rem 7rem 0',
    paddingRight: '1rem',
    height: '100vh',
    overflow: 'scroll',
  },
})
