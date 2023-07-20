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
  left: '0',
  display: 'flex',
  zIndex: 998,
  overflow: 'scroll',
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
  padding: '3rem',
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
  position: 'absolute',
  zIndex: 999,
  top: '6%',
  left: '92%',
  transform: 'translate(-50%, -50%)',

  svg: {
    fontSize: '1.4rem',
    color: '$gray400',
  },
})
