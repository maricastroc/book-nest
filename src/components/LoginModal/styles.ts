import { styled } from '../../styles'

import {
  Overlay as RadixOverlay,
  Content as RadixContent,
  Title as RadixTitle,
  Description as RadixDescription,
  Close as RadixClose,
} from '@radix-ui/react-dialog'

export const Overlay = styled(RadixOverlay, {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  inset: 0,
  zIndex: 9998,
  backgroundColor: 'rgba(10, 10, 10, 0.7)',
})

export const Content = styled(RadixContent, {
  padding: '3rem 1rem',
  backgroundColor: '$gray700',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 80vw, 300px)',
  borderRadius: '4px',
  zIndex: 9999,

  '@media (min-width: 480px)': {
    padding: '3rem',
    width: 'clamp(300px, 85vw, 460px)',
  },

  '@media (min-width: 768px)': {
    width: 'clamp(320px, 80vw, 480px)',
  },
})

export const Title = styled(RadixTitle, {
  color: '$gray100',
  fontSize: '1.1rem',
  marginTop: '1rem',
  marginBottom: '2rem',
  textAlign: 'center',

  '@media (min-width: 480px)': {
    marginTop: 0,
    textAlign: 'left',
  },
})

export const Description = styled(RadixDescription, {
  fontSize: '0.9rem',
  width: '100%',
  marginTop: '1rem',
  textAlign: 'left',
  color: '$gray300',
  lineHeight: '180%',
})

export const CloseButton = styled(RadixClose, {
  color: '$gray300',
  fontWeight: '700',
  position: 'absolute',
  display: 'flex',
  transform: 'translate(-50%, -50%)',
  top: '8%',
  left: '93%',
  cursor: 'pointer',
  backgroundColor: '$gray700',
  border: '0',

  svg: {
    color: '$gray300',
    fontSize: '1.5rem',
  },

  '&:hover': {
    transition: '200ms',

    svg: {
      color: '$purple100',
    },
  },

  '&:focus': {
    boxShadow: '0 0 0 2px $purple100',
  },

  '@media (min-width: 480px)': {
    top: '15%',
    left: '93%',
  },
})

export const ButtonsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 480px)': {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export const ButtonAccess = styled('button', {
  cursor: 'pointer',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '1.25rem',
  backgroundColor: '$gray600',
  borderRadius: 8,
  padding: '1.25rem 1.5rem',
  width: '15rem',
  fontSize: '0.95rem',

  svg: {
    fontSize: 32,
  },

  p: {
    color: '$gray100',
  },

  '& .rocket-icon': {
    color: '$purple100',
  },

  '&:hover': {
    backgroundColor: '$gray500',
    transition: 'all 200ms',
  },

  '@media (min-width: 480px)': {
    fontSize: '1.1rem',
    width: '23.25rem',
  },

  '@media (min-width: 820px)': {
    width: 'clamp(15rem, 40vw, 23rem)',
  },

  '@media (min-width: 920px)': {
    width: '23.25rem',
  },
})
