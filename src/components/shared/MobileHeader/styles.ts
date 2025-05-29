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

export const MobileHeaderWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '1.4rem 1.25rem 1.2rem',
  position: 'fixed',
  backgroundColor: '$gray800',
  top: 0,
  zIndex: 9997,
  borderBottom: 'solid 2px $gray700',

  '@media (min-width: 768px)': {
    padding: '2rem 1.8rem 1.5rem',
    maxWidth: '100%',
  },
})

export const MobileHeaderContent = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  img: {
    width: '8rem',
    height: 'auto',
  },

  '@media (min-width: 480px)': {
    img: {
      width: '8.5rem',
      height: 'auto',
    },
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
    fontSize: '1.65rem',
  },

  '@media (min-width: 480px)': {
    svg: {
      fontSize: '1.8rem',
    },
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
