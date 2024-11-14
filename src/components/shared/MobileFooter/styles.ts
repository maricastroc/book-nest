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

export const MobileFooterBox = styled('div', {
  position: 'fixed',
  bottom: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$gray800',
  width: '100%',
  marginTop: '1rem',
  padding: '0.5rem 1rem',
  overflowX: 'hidden',

  transition: '200ms',
  animation: `${entranceAnimation} 1s`,
})

export const PagesLinksContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  overflowX: 'hidden',

  '@media (min-width: 360px)': {
    justifyContent: 'space-between',
    width: 'clamp(360px, 85vw, 500px)',
    padding: '0 0.8rem',
  },

  '&.unauthorized': {
    justifyContent: 'center',
    gap: '4rem',
  },
})

export const PageLink = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.3rem',

  p: {
    color: '$gray400',
    fontSize: '0.75rem',
  },

  svg: {
    fontSize: '1.3rem',
    color: '$gray400',
  },

  '&.active': {
    p: {
      color: '$green100',
    },

    svg: {
      color: '$green100',
    },
  },
})
