import { styled } from '@/styles'

export const BookStatsWrapper = styled('footer', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '1rem',

  '@media (min-width: 480px)': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    width: '100%',
  },
})

export const StatWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',

  svg: {
    fontSize: '1.5rem',
    color: '$green100',
  },

  '@media (min-width: 480px)': {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0.5rem',

    svg: {
      fontSize: '1.7rem',
    },
  },

  '@media (min-width: 680px)': {
    svg: {
      fontSize: '1.9rem',
    },
  },
})

export const StatText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  alignItems: 'flex-start',

  p: {
    fontSize: '$sm',
    color: '$gray300',
  },

  h2: {
    fontSize: '0.95rem',
    color: '$white',
  },

  '@media (min-width: 480px)': {
    alignItems: 'center',
    textAlign: 'center',
  },

  '@media (min-width: 680px)': {
    h2: {
      fontSize: '1.1rem',
      color: '$white',
    },
  },
})
