import { styled } from '@/styles'

export const MobileHeaderBox = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '1.2rem',
  position: 'fixed',
  backgroundColor: '$gray800',
  borderBottom: '1px solid $gray700',
  top: 0,
  maxWidth: '45rem',
  zIndex: 10,

  '@media (min-width: 480px)': {
    padding: '2rem 1.8rem 1.5rem',
  },

  '@media (min-width: 768px)': {
    maxWidth: '100%',
  },
})

export const MobileHeaderContent = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',

  img: {
    width: '8.8rem',
    height: 'auto',
  },
})
