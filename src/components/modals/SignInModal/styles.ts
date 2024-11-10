import { styled } from '@/styles'

import {
  Content as RadixContent,
  Close as RadixClose,
} from '@radix-ui/react-dialog'

export const Content = styled(RadixContent, {
  padding: '2rem',
  backgroundColor: '$gray700',
  position: 'fixed',
  top: '50%',
  left: '50%',
  display: 'flex',
  flexDirection: 'column',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 85vw, 100%)',
  borderRadius: '4px',
  zIndex: 9998,
  overflow: 'scroll',
  maxHeight: '78vh',
  border: 'solid 1px $gray500',

  '@media (min-width: 480px)': {
    padding: '2.5rem 2.5rem 2rem',
    width: 'clamp(300px, 85vw, 460px)',
  },

  '@media (min-width: 768px)': {
    width: 'clamp(320px, 80vw, 480px)',
  },
})

export const SignInModalHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '2rem',

  h2: {
    fontSize: '1.1rem',
  },
})

export const LoginModalContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
})

export const CloseButton = styled(RadixClose, {
  color: '$gray300',
  fontWeight: '700',
  display: 'flex',
  cursor: 'pointer',
  backgroundColor: '$gray700',
  border: '0',
  width: '1.5rem',
  height: '1.5rem',
  marginRight: '-1.5rem',
  marginTop: '-1.9rem',

  svg: {
    color: '$gray300',
    fontSize: '1.2rem',
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
