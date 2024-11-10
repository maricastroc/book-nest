import { styled } from '@/styles'

export const UserLibraryPageWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100vw',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 768px)': {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'flex-start',
    padding: '0 0 0 1rem',
    paddingLeft: '18rem',
  },

  '@media (min-width: 1024px)': {
    gap: '3rem',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    height: '100vh',
  },

  '@media (min-width: 1200px)': {
    paddingLeft: '19rem',
  },

  '@media (min-width: 1800px)': {
    minWidth: 'auto',
    maxWidth: '80rem',
    margin: '0 auto',
  },
})

export const UserLibraryHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 0.65rem',
  width: '100%',

  '@media (min-width: 480px)': {
    padding: 0,
  },
})

export const UserLibraryBody = styled('div', {
  display: 'flex',
  width: '100%',
  gap: '2.5rem',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  height: '100%',

  paddingTop: '2rem',

  '@media (min-width: 480px)': {
    gap: '1.5rem',
  },

  '@media (min-width: 768px)': {
    marginTop: '2rem',
    padding: '1.5rem 0',
    gap: '1.8rem',
  },

  '@media (min-width: 1024px)': {
    maxWidth: '100%',
    justifyContent: 'flex-start',
    padding: '1.5rem 0',
  },

  '@media (min-width: 1200px)': {
    marginTop: '0.5rem',
  },
})

export const UserLibraryContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  width: '100%',
  gap: 0,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  height: '100%',

  '@media (min-width: 1024px)': {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    height: '100%',

    padding: '0 1.25rem 0 0',
  },
})

export const UserLibraryHeading = styled('div', {
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  alignSelf: 'start',
  gap: '0.8rem',
  textAlign: 'left',
  width: '100%',

  '@media (min-width: 480px)': {
    marginBottom: '1rem',
  },

  '@media (min-width: 1024px)': {
    display: 'flex',
    marginTop: '0.5rem',
  },
})

export const UserLibraryHeadingTitle = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: '0.8rem',

  h2: {
    fontSize: '1.5rem',
  },

  svg: {
    fontSize: '2rem',
    color: '$green100',
  },

  '@media (min-width: 768px)': {
    justifyContent: 'flex-start',
    paddingLeft: '0.8rem',
  },

  '@media (min-width: 1024px)': {
    paddingLeft: 0,
  },
})

export const UserDetailsContainer = styled('div', {
  alignItems: 'flex-start',
  flexDirection: 'column',
  padding: '0 2rem',
  width: '100%',

  '@media (min-width: 768px)': {
    marginTop: '2.5rem',
  },

  '@media (min-width: 1024px)': {
    height: '100vh',
    overflow: 'scroll',
    padding: 0,
    paddingBottom: '2.5rem',
    marginTop: '-3.5rem',
  },

  '@media (min-width: 1200px)': {
    height: '100vh',
    overflow: 'scroll',
    paddingBottom: '10rem',
  },
})

export const ListByBookStatusContainer = styled('div', {
  width: '100%',

  '@media (min-width: 1024px)': {
    height: '100vh',
    overflow: 'scroll',
    padding: 0,
    paddingRight: '1rem',
  },

  '@media (min-width: 1200px)': {
    height: '100vh',
    overflow: 'scroll',
  },
})
