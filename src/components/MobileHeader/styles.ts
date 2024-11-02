import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '2rem 1rem 1.5rem',
  position: 'sticky',
  backgroundColor: '$gray800',
  top: 0,
  maxWidth: '45rem',
  zIndex: 10,
  borderBottom: 'solid 2px $gray700',

  '@media (min-width: 480px)': {
    padding: '2rem 1.8rem 1.5rem',
  },

  '@media (min-width: 768px)': {
    maxWidth: '100%',
  },
})

export const HeaderContainer = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  img: {
    width: '8.5rem',
    height: 'auto',
  },
})

export const ListContainer = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',

  svg: {
    color: '$white',
    fontSize: '1.8rem',
  },
})
