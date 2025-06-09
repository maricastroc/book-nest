import { styled } from '@/styles'

export const PageContent = styled('div', {
  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: '5rem',

  '@media (min-width: 768px)': {
    paddingRight: '1rem',
    justifyContent: 'flex-start',
    overflowY: 'scroll',
  },
})

export const BooksContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1rem',
  width: '100%',
  marginBottom: '2rem',

  '&.empty': {
    gridTemplateColumns: '1fr',
  },

  '@media (min-width: 650px)': {
    gridTemplateColumns: '1fr 1fr',
  },

  '@media (min-width: 1200px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1.5rem',
  },

  '@media (min-width: 1600px)': {
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
  },
})
