import { styled } from '../../styles'

export const Container = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '2rem 1rem 1.5rem',
  position: 'sticky',
  backgroundColor: '$gray800',
  top: 0,
  maxWidth: '35rem',
  zIndex: 10,
  borderBottom: 'solid 2px $gray700',

  img: {
    width: '8.5rem',
    height: 'auto',
  },

  svg: {
    color: '$white',
    fontSize: '1.8rem',
  },

  '@media (min-width: 480px)': {
    padding: '2rem 1.8rem 1.5rem',
  },
})
