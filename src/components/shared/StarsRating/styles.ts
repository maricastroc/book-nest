import { styled } from '@/styles'

export const Rating = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.05rem',

  svg: {
    fontSize: '1.05rem',
    color: '$purple80',
  },

  '&.secondary': {
    svg: {
      fontSize: '1.1rem',
      color: '$green100',
    },
  },

  '@media (min-width: 480px)': {
    svg: {
      fontSize: '1.1rem',
      color: '$purple80',
    },
  },
})
