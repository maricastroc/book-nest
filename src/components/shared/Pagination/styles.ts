import { styled } from '@/styles'

export const PaginationContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: '1.2rem',
  width: '100%',
})

export const PaginationButton = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '6px',
  backgroundColor: '$gray600',
  color: '$gray100',
  transition: 'all 0.2s',

  '&:hover:not(:disabled)': {
    backgroundColor: '$gray500',
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

export const PaginationPage = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '6px',
  backgroundColor: '$gray700',
  color: '$gray100',
  transition: 'all 0.2s',

  '&:hover': {
    backgroundColor: '$gray600',
  },

  variants: {
    active: {
      true: {
        backgroundColor: '$purple200',
        color: '$white',
        fontWeight: 'bold',
      },
    },
  },
})
