import { styled } from '@/styles'

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
  padding: '2rem',
  backgroundColor: '$gray700',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(320px, 80vw, 340px)',
  borderRadius: '4px',
  zIndex: 9999,

  '@media (min-width: 768px)': {
    width: 'clamp(320px, 80vw, 358px)',
  },
})

export const Title = styled(RadixTitle, {
  color: '$gray100',
  fontSize: '1.35rem',
  textAlign: 'left',
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
  top: '15%',
  left: '93%',
  cursor: 'pointer',
  backgroundColor: '$gray700',
  border: '0',

  svg: {
    color: '$white',
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
})

export const ConfirmButton = styled(RadixClose, {
  marginTop: '2rem',
  color: '$purple100',
  width: '100%',
  textAlign: 'center',
  padding: '0.625rem',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: '2px solid $purple100',
  borderRadius: 8,

  '&:hover': {
    backgroundColor: '$purple100',
    transition: 'all 200ms',
    border: '2px solid $purple100',
    color: '$gray100',
  },
})
