import { styled } from '@/styles'

export const BookStatusListWrapper = styled('div', {
  alignItems: 'flex-start',
  width: '100%',
  gap: '2rem',

  '@media (min-width: 1024px)': {
    height: '100vh',
    overflow: 'scroll',
    padding: 0,
    paddingBottom: '7rem',
    paddingRight: '1rem',
  },

  '@media (min-width: 1200px)': {
    height: '100vh',
    overflow: 'scroll',
  },
})
