import { styled } from '@/styles'

export const StatusBoxesContainer = styled('div', {
  width: '100%',
  gap: '2rem',

  '@media (min-width: 1024px)': {
    height: '100vh',
    overflow: 'scroll',
    padding: 0,
    paddingBottom: '5rem',
    paddingRight: '1rem',
  },

  '@media (min-width: 1200px)': {
    height: '100vh',
    overflow: 'scroll',
  },
})
