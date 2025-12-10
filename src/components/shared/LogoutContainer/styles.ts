import { styled } from '@/styles'

export const LogoutWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',
})

export const LogoutContent = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.7rem',

  svg: {
    cursor: 'pointer',
    color: '$red300',
    fontSize: '1.5rem',

    '&.logout': {
      color: '$red300',
    },

    '&.login': {
      color: '$green100',
    },
  },

  p: {
    fontSize: '0.95rem',
    color: '$gray100',
  },

  '&:hover': {
    svg: {
      filter: 'brightness(1.4)',
      transition: '200ms all',
    },

    p: {
      filter: 'brightness(1.4)',
      transition: '200ms all',
    },
  },
})
