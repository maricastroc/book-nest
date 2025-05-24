import { keyframes } from '@stitches/react'
import { styled } from '@/styles'
import {
  Overlay as RadixOverlay,
  Content as RadixContent,
} from '@radix-ui/react-dialog'

const entranceAnimation = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
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

export const Content = styled(RadixContent, {
  padding: '2.5rem 2.5rem 2rem',
  backgroundColor: '$gray800',
  position: 'fixed',
  top: '50%',
  left: '0%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transform: 'translate(-50%, -50%)',
  width: '30rem',
  zIndex: 9998,
  borderColor: 'transparent',
  overflowY: 'scroll',
  height: '100%',

  '@media (min-width: 480px)': {
    width: 'clamp(300px, 100vw, 460px)',
  },
})

export const LateralMenuWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  height: '100%',
  justifyContent: 'space-between',
  border: 'none',
  width: '20rem',
  marginLeft: '14.5rem',

  transition: '200ms',
  animation: `${entranceAnimation} 1s`,
})

export const LogoAndLinksWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '3rem',

  img: {
    width: '8.2rem',
    height: 'auto',
    marginLeft: '-0.1rem',
  },
})

export const LoginModalContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
})

export const ItemsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '2rem',
})
