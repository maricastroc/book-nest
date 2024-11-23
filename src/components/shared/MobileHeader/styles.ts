import { styled } from '@/styles'

export const MobileHeaderBox = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '0.95rem 1.7rem',
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
    width: '8.5rem',
    height: 'auto',
  },
})

export const LogoAndIcon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  img: {
    width: '8.5rem',
    height: 'auto',
  },
})

export const SignOutButton = styled('button', {
  display: 'flex',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$white',
  gap: '0.8rem',

  svg: {
    color: '$red300',
    fontSize: '1.5rem',
  },

  p: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '$gray300',
  },
})
