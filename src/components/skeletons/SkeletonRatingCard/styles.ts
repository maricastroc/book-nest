import { styled } from '@/styles'

export const Container = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '100%',

  '&.marginBottom': {
    marginBottom: '1.5rem',
  },
})

export const Header = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  width: '100%',
  gap: '1rem',
  marginBottom: '1.5rem',
})

export const Main = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
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
