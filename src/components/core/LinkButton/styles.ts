import { styled } from '@/styles'

export const StyledLinkButton = styled('button', {
  backgroundColor: '$transparent',
  cursor: 'pointer',
  fontSize: '0.9375rem',
  border: 'none',
  color: '$white',
  marginTop: 0,
  fontWeight: 300,

  span: {
    color: '$purple50',
    transition: '200ms ease',
  },

  '&:hover': {
    span: {
      color: '$white',
    },
  },

  '@media (min-width: 480px)': {
    fontSize: '0.9rem',
  },
})
