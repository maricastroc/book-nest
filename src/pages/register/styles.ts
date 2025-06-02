import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'auto',
})

export const LogoWrapper = styled('div', {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem',
  gap: '0.75rem',

  img: {
    scale: '0.85',
  },
})
