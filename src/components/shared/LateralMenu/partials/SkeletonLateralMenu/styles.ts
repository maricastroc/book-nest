import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  gap: '1.5rem',
})

export const BookWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '2rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  gap: '1.5rem',
})

export const BookSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',
  width: '100%',

  '@media (min-width: 580px)': {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
  },
})

export const Book = styled('div', {
  height: 'auto',
  width: '50%',
  maxWidth: '10rem',

  '@media (min-width: 580px)': {
    width: '100%',
  },
})

export const BookData = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'space-between',
  justifyContent: 'space-between',
  height: '100%',
  width: '100%',
})

export const TitleAndAuthor = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
  marginBottom: '1.5rem',
})

export const Main = styled('div', {
  width: '100%',
  gap: '1rem',
})
