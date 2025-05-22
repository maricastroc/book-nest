import { styled } from '@/styles'

import {
  Content as RadixContent,
  Title as RadixTitle,
  Close as RadixClose,
} from '@radix-ui/react-dialog'

import {
  Root as RadixRoot,
  Indicator as RadixIndicator,
} from '@radix-ui/react-checkbox'

export const StyledCheckbox = styled(RadixRoot, {
  all: 'unset',
  backgroundColor: 'transparent',
  width: 18,
  height: 18,
  borderRadius: 4,
  border: 'solid 1px rgba(131, 129, 217, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, border-color 0.2s ease',

  '&[data-state="checked"]': {
    backgroundColor: 'transparent',
    border: 'solid 1px rgba(131, 129, 217, 0.5)',
  },

  '&:focus': {
    outline: 'none',
  },
})

export const StyledIndicator = styled(RadixIndicator, {
  color: 'white',
})

export const Content = styled(RadixContent, {
  padding: '1.5rem 1rem 3rem',
  backgroundColor: '$gray700',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 80vw, 300px)',
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
  fontSize: '1rem',
  textAlign: 'start',
  width: '80%',
  marginBottom: '1rem',
  fontWeight: 300,

  '@media (min-width: 480px)': {
    marginBottom: 0,
    fontSize: '$3xl',
  },
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

  svg: {
    color: '$gray300',
    fontSize: '1.3rem',
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
    marginTop: 0,
  },
})

export const ChangePasswordInputContainer = styled('div', {
  display: 'flex',
  gap: '0.6rem',
  width: '100%',
  alignItems: 'center',
  marginTop: '1rem',
  fontSize: '0.9375rem',
})
