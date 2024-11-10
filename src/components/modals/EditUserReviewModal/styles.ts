import { styled } from '@/styles'

import {
  Content as RadixContent,
  Title as RadixTitle,
  Close as RadixClose,
} from '@radix-ui/react-dialog'

export const Content = styled(RadixContent, {
  backgroundColor: '$gray700',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 80vw, 38rem)',
  borderRadius: '4px',
  height: 'auto',
  zIndex: 9998,
  overflow: 'scroll',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

  '@media (min-width: 480px)': {
    padding: '0 0.5rem',
    width: 'clamp(440px, 80vw, 38rem)',
  },

  '&:focus': {
    outline: 'none',
    border: 'none',
  },
})

export const Title = styled(RadixTitle, {
  color: '$gray100',
  fontSize: '1.35rem',
  textAlign: 'left',
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
