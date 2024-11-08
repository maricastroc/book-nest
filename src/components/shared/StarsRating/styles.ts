import { styled } from '@/styles'

export const Rating = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.05rem',

  svg: {
    fontSize: '1rem',
    color: '$purple100',
  },

  '&.secondary': {
    svg: {
      fontSize: '1.1rem',
      color: '$green100',
    },
  },
})
