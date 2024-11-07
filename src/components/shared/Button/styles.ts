import { styled } from '@/styles'

export const StyledButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.7rem',
  cursor: 'pointer',
  color: '$purple50',
  backgroundColor: 'transparent',
  padding: '0.6rem',
  fontSize: '0.95rem',
  border: '1px solid $purple100',
  width: '100%',

  svg: {
    color: '$purple50',
  },

  '&.rounded': {
    borderRadius: 8,
  },

  '&:hover': {
    backgroundColor: '$purple200',
    borderColor: '$purple200',
    transition: '250ms all',
    color: '$gray100',

    svg: {
      color: '$gray100',
    },
  },

  '&:disabled': {
    backgroundColor: 'rgba(131, 129, 217, 0.5)',
    border: 'solid 1px rgba(131, 129, 217, 0.5)',
    color: '$gray100',
    cursor: 'not-allowed',
    pointerEvents: 'none',

    '&:hover': {
      backgroundColor: '$gray400',
    },
  },
})
