import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: '0 1rem',

  '@media (min-width: 580px)': {
    padding: '0 2rem',
  },

  '@media (min-width: 768px)': {
    padding: 0,
    paddingRight: '1.5rem',
  },

  '@media (min-width: 1024px)': {
    padding: 0,
  },
})
