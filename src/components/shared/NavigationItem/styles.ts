import { styled } from '@/styles'

export const Container = styled('div', {
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  backgroundColor: 'transparent',
  border: 'none',

  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },
})

export const NavButton = styled('button', {
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  backgroundColor: 'transparent',
  color: '$gray400',
  border: 'none',

  p: {
    fontSize: '1rem',
  },

  svg: {
    fontSize: '1.5rem',
    color: '$gray400',
  },

  '&.active': {
    p: {
      color: '$green100',
      fontWeight: 'bold',
    },

    svg: {
      color: '$green100',
    },
  },

  '&:hover': {
    p: {
      color: '$gray100',
    },

    svg: {
      color: '$gray100',
    },
  },

  '&:focus': {
    boxShadow: 'none',
    outline: 'none',
  },

  variants: {
    active: {
      true: {
        p: {
          color: '$gray100',
          fontWeight: 'bold',
        },

        svg: {
          color: '$gray100',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '4px',
          background: '$gradient-vertical',
          borderRadius: 8,
        },
      },
    },
  },
})
