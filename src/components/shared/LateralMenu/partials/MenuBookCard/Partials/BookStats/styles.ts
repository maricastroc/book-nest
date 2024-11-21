import { styled } from '@/styles'

export const BookStatsWrapper = styled('footer', {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: '0.7rem',
})

export const StatWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  backgroundColor: 'rgba(131, 129, 217, 0.1)',
  padding: '0.4rem 0.7rem',
  borderRadius: 4,

  svg: {
    fontSize: '1rem',
    color: '$purple100',
  },

  '@media (min-width: 480px)': {
    svg: {
      fontSize: '1.2rem',
    },
  },
})

export const StatText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  alignItems: 'flex-start',
  fontWeight: 700,

  p: {
    fontSize: '0.8rem',
    color: '$gray200',
  },

  '@media (min-width: 480px)': {
    p: {
      fontSize: '0.85rem',
    },
  },
})
