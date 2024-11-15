import { styled } from '@/styles'

export const Container = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'flex-start',
  justifyContent: 'center',
  minWidth: '100%',
  height: '8rem',

  '@media (min-width: 1200px)': {
    padding: '2rem',
  },
})

export const Main = styled('div', {
  display: 'flex',
  width: '100%',
  gap: '1rem',
})

export const Content = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr 1fr',
  width: '100%',
  gap: '1rem',
})
