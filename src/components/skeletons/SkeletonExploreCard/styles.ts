import { styled } from '@/styles'

export const Container = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  padding: '1.2rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '100%',

  '@media (min-width: 1024px)': {
    padding: '1.5rem',
  },
})

export const Main = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minWidth: '100%',
  gap: '1rem',
})

export const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '1rem',
  minWidth: '100%',
})
