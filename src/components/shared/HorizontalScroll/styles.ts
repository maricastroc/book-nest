import { styled } from '@/styles'

export const Wrapper = styled('div', {
  position: 'relative',
  width: '100%',
})

export const ScrollTrack = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.75rem',
  overflowX: 'auto',
  width: '100%',

  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

export const ArrowButton = styled('button', {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: '50%',
  border: '1px solid $gray600',
  backgroundColor: '$gray700',
  color: '$gray200',
  cursor: 'pointer',
  transition: 'background-color 150ms ease, opacity 150ms ease',

  '&:hover': {
    backgroundColor: '$gray600',
  },

  '&:disabled': {
    opacity: 0,
    cursor: 'default',
    pointerEvents: 'none',
  },

  svg: {
    width: '1rem',
    height: '1rem',
  },

  variants: {
    side: {
      left: { left: '0.25rem' },
      right: { right: '0.25rem' },
    },
  },
})
