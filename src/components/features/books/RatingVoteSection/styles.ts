import { styled } from '@/styles'

export const RatingActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: '0.75rem',
  marginTop: '0.75rem',
  paddingTop: '0.75rem',
  borderTop: '1px solid rgba(255,255,255,0.06)',
})

export const RatingButton = styled('button', {
  display: 'flex',
  backgroundColor: 'transparent',
  border: 'none',
  alignItems: 'center',
  gap: '0.35rem',
  color: '#65656e',
  cursor: 'pointer',
  transition: 'color 150ms',

  '&:hover:not(:disabled)': {
    color: '#9c9ca4',
  },

  svg: {
    fontSize: '0.95rem',
    color: 'inherit',
  },

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
  },

  p: {
    fontSize: '0.78rem',
    fontWeight: 500,
    color: 'inherit',
  },
})
