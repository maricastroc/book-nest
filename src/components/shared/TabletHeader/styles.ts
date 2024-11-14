import { keyframes } from '@stitches/react'
import { styled } from '@/styles'

const entranceAnimation = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

export const TabletHeaderWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '2rem 1rem 1.5rem',
  position: 'fixed',
  backgroundColor: '$gray800',
  top: 0,
  maxWidth: '45rem',
  zIndex: 10,
  borderBottom: 'solid 2px $gray700',

  '@media (min-width: 480px)': {
    padding: '2rem 1.8rem 1.5rem',
  },

  '@media (min-width: 768px)': {
    maxWidth: '100%',
  },
})

export const TabletHeaderContent = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  img: {
    width: '8.5rem',
    height: 'auto',
  },
})

export const LinksContainer = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',

  svg: {
    color: '$white',
    fontSize: '1.8rem',
  },
})

export const LateralMenu = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  backgroundColor: '$gray700',
  border: 'none',
  width: '30rem',

  transition: '200ms',
  animation: `${entranceAnimation} 1s`,
})
