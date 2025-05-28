import { styled } from '@/styles'

export const StyledOutlineButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '$sm',
  color: '$purple100',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',

  svg: {
    fontSize: '1rem',
    color: '$purple100',
    marginLeft: '0.4rem',
  },

  '&:hover': {
    filter: 'brightness(1.4)',
    transition: '200ms all',
  },
})
