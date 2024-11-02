import { keyframes } from '@stitches/react'
import { styled } from '../../styles'

const entranceAnimation = keyframes({
  from: {
    translate: '100%',
  },
  to: {
    translate: '0%',
  },
})

export const Container = styled('section', {
  position: 'fixed',
  top: '0',
  right: '0',
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 998,
  overflow: 'scroll',
  width: '100%',
  maxWidth: '41.5rem',
})

export const ContainerOverlay = styled('div', {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
})

export const LateralMenuContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  backgroundColor: '$gray800',
  height: '100vh',
  overflow: 'scroll',
  width: '100%',
  padding: '4.5rem 3rem 3rem',
  borderRadius: 8,
  animation: `${entranceAnimation} 0.4s`,
})

export const RatingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.2rem',

  p: {
    color: '$gray500',
    fontSize: '0.75rem',
  },
})

export const CloseButton = styled('div', {
  cursor: 'pointer',
  position: 'absolute',
  zIndex: 999,
  top: '6%',
  left: '92%',
  transform: 'translate(-50%, -50%)',

  svg: {
    fontSize: '1.4rem',
    color: '$gray400',
  },

  '@media (min-width: 580px)': {
    top: '6%',
    left: '92%',
  },
})

export const RatingsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '0.5rem',
  marginTop: '3rem',
})

export const RatingsContentTitle = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  p: {
    fontSize: '$sm',
    color: '$gray200',
  },

  span: {
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '$purple100',
    fontWeight: 'bold',

    '&:hover': {
      filter: 'brightness(1.3)',
      transition: '200ms all ease-in-out',
    },
  },
})

export const RatingsContent = styled('div', {
  display: 'flex',
  flexDirection: 'column-reverse',
  minWidth: '100%',
  gap: '1.5rem',
})
