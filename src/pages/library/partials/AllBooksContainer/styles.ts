import { styled } from '@/styles'

export const AllBooksWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  padding: '1rem 0 1rem 0',

  '@media (min-width: 1024px)': {
    height: '100vh',
    overflow: 'scroll',
    padding: '0 1rem 9rem',
  },

  '@media (min-width: 1200px)': {
    height: '100vh',
    overflow: 'scroll',
  },
})

export const AllBooksMainContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  marginTop: '1rem',
})

export const AllBooksContent = styled('div', {
  display: 'grid',
  gap: '0.65rem',
  justifyContent: 'center',
  padding: '2rem 0',
  borderRadius: 12,
  backgroundColor: '$gray700',
  alignContent: 'flex-start',
  width: '100%',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',

  '@media (min-width: 480px)': {
    padding: '2rem 1rem',
  },
})

export const TagStatus = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '0.7rem',
  fontWeight: 600,
  borderRadius: 15,
  color: '$gray300',

  svg: {
    color: '$green100',
    fontSize: '1.05rem',
  },

  '&.reading': {
    svg: {
      color: '#ca4036',
    },
  },

  '&.read': {
    svg: {
      color: '$green100',
    },
  },

  '&.want_to_read': {
    svg: {
      color: '#c64a96',
    },
  },

  '&.did_not_finish': {
    svg: {
      color: '#cc803d',
    },
  },
})

export const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '1rem',
})
