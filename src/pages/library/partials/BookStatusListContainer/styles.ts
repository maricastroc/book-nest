import { styled } from '@/styles'

export const Container = styled('div', {
  width: '100%',

  '@media (min-width: 1200px)': {
    maxHeight: '100vh',
    overflowY: 'scroll',
  },
})

export const BookStatusListWrapper = styled('div', {
  width: '100%',
  gap: '2rem',

  '@media (min-width: 1200px)': {
    padding: '0 1rem 7rem 0',
    paddingRight: '1rem',
  },
})
