import { styled } from '@/styles'

import {
  Content as RadixContent,
  Close as RadixClose,
  Title as RadixTitle,
} from '@radix-ui/react-dialog'

export const Content = styled(RadixContent, {
  padding: '2rem',
  backgroundColor: '$gray700',
  position: 'fixed',
  top: '50%',
  left: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 85vw, 100%)',
  borderRadius: '4px',
  zIndex: 9999,
  overflow: 'scroll',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

  '@media (min-width: 480px)': {
    padding: '2.5rem 2.5rem 2rem',
    width: 'clamp(300px, 85vw, 460px)',
  },

  '@media (min-width: 768px)': {
    width: 'clamp(320px, 80vw, 480px)',
  },

  svg: {
    width: '1.5rem',
    height: '1.5rem',
  },

  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
    border: 'none',
  },
})

export const Title = styled(RadixTitle, {
  color: '$gray100',
  fontSize: '1.35rem',
  textAlign: 'left',
})

export const ReadBookModalHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '2rem',
  textAlign: 'center',

  p: {
    fontSize: '1rem',
  },
})

export const ReadBookModalContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

export const CloseButton = styled(RadixClose, {
  position: 'absolute',
  color: '$gray300',
  fontWeight: '700',
  display: 'flex',
  cursor: 'pointer',
  backgroundColor: '$gray700',
  border: '0',
  width: '1.5rem',
  height: '1.5rem',
  left: '27.5rem',
  top: '1.2rem',

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
