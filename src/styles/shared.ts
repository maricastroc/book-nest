import { styled } from '@/styles'

import {
  Title as RadixTitle,
  Close as RadixClose,
  Content as RadixContent,
  Overlay as RadixOverlay,
  Description as RadixDescription,
} from '@radix-ui/react-dialog'

import { keyframes } from '@stitches/react'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

export const ReadNotice = styled('div', {
  display: 'flex',
  position: 'absolute',
  top: 0,
  right: '0.3rem',
  padding: '0.1rem 0.5rem',
  fontSize: '1.25rem',
  fontWeight: 700,
  borderRadius: '0 8px 0 8px',
  color: '$green100',

  '&.reading': {
    svg: {
      color: '#ca4036',
    },
  },

  '&.read': {
    svg: {
      color: '$green100',
    },
  },

  '&.want_to_read': {
    svg: {
      color: '#c64a96',
    },
  },

  '&.did_not_finish': {
    svg: {
      color: '#cc803d',
    },
  },
})

export const UserActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: '1rem',
  width: '100%',
  gap: '0.6rem',
  marginTop: '0.5rem',
  borderRadius: 8,

  svg: {
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '$gray400',

    '&.edit_icon': {
      color: '$green100',
    },

    '&.delete_icon': {
      color: '#C6616D',
    },

    '&:hover': {
      filter: 'brightness(1.5)',
      transition: '200ms ease-in-out',
    },
  },
})

export const ReadingStatusButton = styled('button', {
  backgroundColor: '$gray800',
  width: '1.5rem',
  height: '1.5rem',
  color: '$gray800',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.7rem',
  borderRadius: '50%',
  border: '2px solid $green100',

  svg: {
    color: '$green100',
    width: '0.7rem',
    height: '0.7rem',
  },
})

export const Overlay = styled(RadixOverlay, {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  inset: 0,
  zIndex: 9997,
  backgroundColor: 'rgba(10, 10, 10, 0.7)',
})

export const Description = styled(RadixDescription, {
  fontSize: '0.9rem',
  width: '100%',
  marginTop: '1rem',
  textAlign: 'left',
  color: '$gray300',
  lineHeight: '180%',
})

export const ActionButton = styled('button', {
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.7rem',
  cursor: 'pointer',
  color: '$green100',
  padding: '0.4rem 0.6rem',
  fontSize: '0.85rem',
  borderRadius: 10,
  border: 'solid 1px $green100',
  width: 'auto',
  marginTop: '1rem',

  svg: {
    color: '$green100',
  },

  '&:hover': {
    backgroundColor: '$green200',
    color: '#FFFFFF',
    transition: '200ms',
    border: 'solid 1px $green200',

    svg: {
      color: '#FFFFFF',
    },
  },

  '&:focus': {
    outline: '1px solid $green200',
  },
})

export const DividerLine = styled('span', {
  width: 30,
  background: '$gradient-horizontal',
  borderRadius: 8,
  height: 4,
  margin: '2.4rem 0',
})

export const PageBtn = styled('button', {
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  backgroundColor: 'transparent',
  color: '$gray400',
  border: 'none',

  p: {
    fontSize: '1rem',
  },

  svg: {
    fontSize: '1.5rem',
    color: '$gray400',
  },

  '&.active': {
    p: {
      color: '$green100',
      fontWeight: 'bold',
    },

    svg: {
      color: '$green100',
    },
  },

  '&:hover': {
    p: {
      color: '$gray100',
    },

    svg: {
      color: '$gray100',
    },
  },

  variants: {
    active: {
      true: {
        p: {
          color: '$gray100',
          fontWeight: 'bold',
        },

        svg: {
          color: '$gray100',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '4px',
          background: '$gradient-vertical',
          borderRadius: 8,
        },
      },
    },
  },
})

export const SignOutContainer = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.7rem',

  svg: {
    color: '#F75A68',
    fontSize: '1.5rem',
  },

  p: {
    fontSize: '0.95rem',
    color: '$gray100',
  },
})

export const SignInContainer = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  justifySelf: 'flex-end',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',
})

export const SignInButton = styled('button', {
  display: 'flex',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$white',
  gap: '0.8rem',

  svg: {
    color: '$green100',
    fontSize: '1.5rem',
  },

  p: {
    fontSize: '1rem',
    color: '$gray300',
  },
})

export const SidebarProfileContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',
})

export const PageBtnWrapper = styled('div', {
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  backgroundColor: 'transparent',
  border: 'none',

  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },
})

export const SearchBar = styled('div', {
  display: 'flex',
  backgroundColor: '$gray800',
  border: 'solid 1px $green200',
  borderRadius: 8,
  padding: '0.7rem 1.25rem',
  marginTop: '0.5rem',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',

  input: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '$white',
    width: '100%',
    fontSize: '0.9rem',

    '&:has(input:focus)': {
      borderColor: '$green200',
    },

    '&:focus': {
      boxShadow: 'none',
      outline: 'none',
      padding: 'none',
      border: 'none',
    },

    '&::placeholder': {
      color: '$gray400',
    },
  },

  svg: {
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '$green200',
  },

  '&:has(input:focus)': {
    borderColor: '$green100',
    svg: {
      color: '$green100',
    },
  },

  '@media (min-width: 480px)': {
    padding: '0.875rem 1.25rem',
    marginTop: 0,
  },

  '@media (min-width: 1024px)': {
    width: '60%',
    maxWidth: '25rem',
  },
})

export const ModalOverlay = styled(RadixOverlay, {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  inset: 0,
  zIndex: 9997,
  backgroundColor: 'rgba(10, 10, 10, 0.2)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',

  variants: {
    hasOverlay: {
      false: {
        backgroundColor: 'transparent',
      },
    },
  },

  '@media (prefers-reduced-motion: no-preference)': {
    '&[data-state="open"]': {
      animation: `${overlayShow} 200ms ease-out forwards`,
    },
    '&[data-state="closed"]': {
      animation: `${overlayShow} 200ms ease-in forwards`,
    },
  },
})

export const ModalDescription = styled(RadixDescription, {
  fontSize: '1rem',
  width: '100%',
  textAlign: 'left',
  color: '$gray300',
  lineHeight: '1.5rem',
  marginBottom: '0.5rem',
})

export const ModalContent = styled(RadixContent, {
  padding: '1.5rem',
  backgroundColor: '$gray700',
  color: '$gray300',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 80vw, 320px)',
  borderRadius: '8px',
  zIndex: 9998,
  overflow: 'scroll',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',
  height: 'auto',

  '&:focus': {
    border: 'none',
    outlineColor: 'none',
  },

  '@media (min-width: 480px)': {
    width: 'clamp(300px, 85vw, 460px)',
    height: 'auto',
  },

  '@media (min-width: 768px)': {
    padding: '2rem',
    width: 'clamp(20rem, 80vw, 30rem)',
  },

  '@media (prefers-reduced-motion: no-preference)': {
    '&[data-state="open"]': {
      animation: `${overlayShow} 200ms ease-out forwards`,
    },
    '&[data-state="closed"]': {
      animation: `${overlayShow} 200ms ease-in forwards`,
    },
  },
})

export const ModalHeader = styled('div', {
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '1rem',

  '@media (min-width: 480px)': {
    alignItems: 'center',
  },
})

export const ModalCloseButton = styled(RadixClose, {
  color: '$gray300',
  fontWeight: '700',
  display: 'flex',
  width: '1.5rem',
  justifyContent: 'flex-end',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: '0',
  marginTop: '0.1rem',

  svg: {
    color: '$gray300',
    fontSize: '1.3rem',
  },

  '&:hover': {
    transition: '200ms ease',

    svg: {
      filter: 'brightness(1.2)',
    },
  },

  '&:focus': {
    boxShadow: '0 0 0 2px $blue600',
  },

  '@media (min-width: 480px)': {
    marginTop: 0,
  },
})

export const ModalTitle = styled(RadixTitle, {
  alignSelf: 'flex-start',
  fontSize: '$2xl',
  fontWeight: 400,
})
