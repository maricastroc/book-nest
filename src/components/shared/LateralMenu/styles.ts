import { keyframes } from '@stitches/react'
import { styled } from '@/styles'

const entranceAnimation = keyframes({
  from: {
    translate: '100%',
  },
  to: {
    translate: '0%',
  },
})

export const LateralMenuWrapper = styled('section', {
  position: 'fixed',
  top: '0',
  right: '0',
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 9998,
  overflow: 'scroll',
  width: '100%',
  maxWidth: '100%',
  height: '100%',

  '@media (min-width: 680px)': {
    maxWidth: '35rem',
  },

  '@media (min-width: 768px)': {
    maxWidth: '41.5rem',
  },
})

export const OverlayBackground = styled('div', {
  position: 'fixed',
  width: '100vw',
  height: '100%',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
})

export const MenuBody = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  backgroundColor: '$gray800',
  height: '100%',
  overflow: 'scroll',
  width: '100%',
  padding: '2rem 1.5rem 2.5rem',
  borderRadius: 8,
  animation: `${entranceAnimation} 0.4s`,

  '@media (min-width: 480px)': {
    padding: '4.5rem 3rem 3rem',
  },
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

export const CloseButton = styled('button', {
  cursor: 'pointer',
  position: 'absolute',
  zIndex: 1,
  top: '6%',
  left: '92%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '$gray700',
  padding: '0.3rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  border: '1px solid $gray500',

  svg: {
    fontSize: '1.2rem',
    color: '$gray400',
  },

  '@media (min-width: 580px)': {
    top: '6%',
    left: '92%',
  },
})

export const RatingsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '0.5rem',
  marginTop: '3rem',
  paddingBottom: '2.5rem',
})

export const RatingsList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minWidth: '100%',
  gap: '1.5rem',

  '&.reverse': {
    flexDirection: 'column',
  },
})

export const RatingsListHeader = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'space-between',
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
