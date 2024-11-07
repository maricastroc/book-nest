import { styled } from '@/styles'

import {
  Content as RadixContent,
  Title as RadixTitle,
  Close as RadixClose,
} from '@radix-ui/react-dialog'

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
