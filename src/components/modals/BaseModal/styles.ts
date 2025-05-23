import { styled } from '@/styles'

import {
  Overlay as RadixOverlay,
  Description as RadixDescription,
  Content as RadixContent,
  Title as RadixTitle,
  Close as RadixClose,
} from '@radix-ui/react-dialog'

export const Overlay = styled(RadixOverlay, {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  inset: 0,
  zIndex: 9997,
  backgroundColor: 'rgba(10, 10, 10, 0.7)',
})

export const Header = styled('div', {
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '2rem',

  '@media (min-width: 480px)': {
    alignItems: 'center',
  },
})

export const Content = styled(RadixContent, {
  padding: '1.5rem',
  backgroundColor: '$gray700',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 80vw, 460px)',
  borderRadius: '4px',
  zIndex: 9998,
  overflow: 'scroll',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',

  '@media (min-width: 480px)': {
    width: 'clamp(300px, 85vw, 460px)',
  },

  '@media (min-width: 768px)': {
    padding: '2rem',
    width: 'clamp(20rem, 80vw, 32rem)',
    maxWidth: '33rem',
  },

  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
    border: 'none',
  },
})

export const Title = styled(RadixTitle, {
  color: '$gray100',
  fontSize: '$3xl',
  textAlign: 'start',
  width: '100%',
  marginBottom: '1rem',
  fontWeight: 300,

  variants: {
    hasAlignMiddleContent: {
      true: {
        textAlign: 'center',
      },
    },
  },

  '@media (min-width: 480px)': {
    marginBottom: 0,
  },
})

export const CloseButton = styled(RadixClose, {
  color: '$gray300',
  fontWeight: '700',
  display: 'flex',
  width: '1.5rem',
  justifyContent: 'flex-end',
  cursor: 'pointer',
  backgroundColor: '$gray700',
  border: '0',
  marginTop: '0.1rem',

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
    marginTop: 0,
  },
})

export const Description = styled(RadixDescription, {
  fontSize: '0.95rem',
  width: '100%',
  textAlign: 'left',
  color: '$gray300',
  lineHeight: '180%',

  variants: {
    hasAlignMiddleContent: {
      true: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
})
