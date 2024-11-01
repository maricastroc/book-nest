import { styled } from '@/styles'

export const StyledButton = styled('button', {
  backgroundColor: '$gray600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.7rem',
  cursor: 'pointer',
  color: '$gray100',
  padding: '0.6rem',
  fontSize: '0.95rem',
  borderRadius: 10,
  border: 'none',
  width: '100%',

  svg: {
    color: '$purple100',
  },

  '&:hover': {
    backgroundColor: '$gray500',
    transition: '200ms',
  },
})
