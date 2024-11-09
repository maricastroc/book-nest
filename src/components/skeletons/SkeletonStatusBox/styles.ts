import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  width: '100%',
  height: '8rem',
})

export const BookContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '0.05rem',
  textAlign: 'center',
  height: '100%',
})

export const BookCover = styled('div', {
  width: '5rem',
  height: 'auto',
  borderRadius: 8,
  opacity: 0.9,
  filter: 'brightness(0.95)',

  '@media (min-width: 1200px)': {
    width: '5.5rem',
  },
})
