import { styled } from '@/styles'

export const UsersPageWrapper = styled('div', {
  marginTop: '3rem',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  maxWidth: '100%',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '100vh',
  overflowX: 'hidden',
  minWidth: '100vw',
  paddingBottom: '5rem',

  '@media (min-width: 480px)': {
    marginTop: '5rem',
    paddingBottom: 0,
  },

  '@media (min-width: 768px)': {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: '0 2rem 0 1rem',
    gap: '2.5rem',
    paddingRight: '2rem',
    paddingLeft: '18rem',
  },

  '@media (min-width: 1024px)': {
    gap: '5rem',
  },
})

export const UsersPageContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '45rem',
  marginTop: '2rem',

  '@media (min-width: 768px)': {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    maxWidth: '100%',
    marginTop: '2rem',
    padding: 0,
  },

  '@media (min-width: 980px)': {
    paddingLeft: '1rem',
  },
})

export const UsersPageHeading = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  alignSelf: 'start',
  gap: '0.8rem',
  textAlign: 'left',
  marginBottom: '1rem',
  width: '100%',

  '@media (min-width: 1024px)': {
    marginTop: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export const TitleAndSearch = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  width: '100%',

  '@media (min-width: 768px)': {
    alignItems: 'flex-start',
    marginTop: '0.5rem',
  },

  '@media (min-width: 1024px)': {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export const HeadingTitle = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.8rem',
  marginBottom: '1.5rem',
  paddingTop: '1.5rem',
  textAlign: 'left',

  h2: {
    fontSize: '1.3rem',
  },

  svg: {
    fontSize: '1.8rem',
    color: '$green100',
  },

  '@media (min-width: 480px)': {
    h2: {
      fontSize: '1.5rem',
    },

    svg: {
      fontSize: '2rem',
      color: '$green100',
    },
  },

  '@media (min-width: 768px)': {
    paddingTop: 0,
  },

  '@media (min-width: 1024px)': {
    marginBottom: 0,
  },
})

export const UsersPageContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 768px)': {
    paddingRight: '1rem',
    justifyContent: 'flex-start',
    overflowY: 'scroll',
  },
})

export const UsersContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '0.8rem',
  marginTop: '1rem',
  width: '100%',
  marginBottom: '1rem',

  '@media (min-width: 460px)': {
    gridTemplateColumns: '1fr 1fr',
  },

  '@media (min-width: 580px)': {
    gap: '1.5rem',
  },

  '@media (min-width: 1050px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
})
