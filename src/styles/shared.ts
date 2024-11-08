import { styled } from '@/styles'

import {
  Overlay as RadixOverlay,
  Description as RadixDescription,
} from '@radix-ui/react-dialog'

export const ReadNotice = styled('div', {
  display: 'flex',
  position: 'absolute',
  top: 0,
  right: '0.3rem',
  padding: '0.1rem 0.5rem',
  fontSize: '0.98rem',
  fontWeight: 700,
  borderRadius: '0 8px 0 8px',
  color: '$green100',

  '@media (min-width: 480px)': {
    fontSize: '1.1rem',
  },

  '@media (min-width: 1024px)': {
    fontSize: '1.2rem',
  },
})

export const UserActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: '1rem',
  width: '100%',
  gap: '0.4rem',
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
  zIndex: 9998,
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
