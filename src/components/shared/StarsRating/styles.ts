import { styled } from '@/styles'

export const Rating = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.3rem',

  svg: {
    fontSize: '$md',
    color: '$purple100',
  },
})
