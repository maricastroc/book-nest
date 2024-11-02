import { keyframes } from '@stitches/react'
import { styled } from '../../styles'

const entranceAnimation = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$gray700',
  border: 'solid 2px $gray600',
  width: '100%',
  marginTop: '1rem',
  padding: '1.5rem',
  borderRadius: 8,

  transition: '200ms',
  animation: `${entranceAnimation} 1s`,
})

export const ItemsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '1.2rem',
})

export const Item = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',

  p: {
    color: '$gray400',
    fontSize: '1rem',
  },

  svg: {
    fontSize: '1.5rem',
    color: '$gray400',
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
          left: '-1rem',
          width: '4px',
          background: '$gradient-vertical',
          borderRadius: 8,
        },
      },
    },
  },
})

export const ProfileContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',
})

export const SignOutContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.7rem',

  svg: {
    color: '#F75A68',
    fontSize: '1.2rem',
  },

  p: {
    fontSize: '0.95rem',
    color: '$gray100',
  },
})

export const Separator = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: '$gray600',
  margin: '1.5rem 0',
})

export const LoginContainer = styled('div', {
  marginTop: '1.5rem',
  cursor: 'pointer',
  display: 'flex',
  justifySelf: 'flex-end',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',
})

export const LoginButton = styled('button', {
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
    fontSize: '1.3rem',
  },

  p: {
    fontSize: '1rem',
    color: '$gray100',
  },
})
