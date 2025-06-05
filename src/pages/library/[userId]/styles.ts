import { styled } from '@/styles'

export const UserLibraryContent = styled('div', {
  marginTop: '2.5rem',
  display: 'flex',
  flexDirection: 'column-reverse',
  width: '100%',
  gap: 0,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  height: '100%',

  '@media (min-width: 1200px)': {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    height: '100%',
    padding: '0 1.25rem 0 0',
  },
})

export const SubmittedBooksContainer = styled('div', {
  alignItems: 'flex-start',
  flexDirection: 'column',
  width: '100%',

  '@media (min-width: 1200px)': {
    height: '100vh',
    padding: 0,
    paddingBottom: '2.5rem',
    marginTop: '-3.5rem',
  },
})
