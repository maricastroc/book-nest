import { styled } from '@/styles'

export const ProfilePageContent = styled('div', {
  marginTop: '2.5rem',
  display: 'flex',
  flexDirection: 'column-reverse',
  padding: 0,
  width: '100%',
  gap: 0,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',

  '@media (min-width: 1024px)': {
    marginTop: '1.8rem',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    height: '100%',
    padding: '0 1.25rem 0 0',
  },
})

export const ProfilePageHeading = styled('div', {
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
    marginTop: '0.5rem',
  },
})

export const ProfilePageHeadingTitle = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.8rem',

  h2: {
    fontSize: '1.5rem',
  },

  svg: {
    fontSize: '2rem',
    color: '$green100',
  },
})

export const UserRatingsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  width: '100%',
  paddingTop: '2rem',

  '@media (min-width: 1024px)': {
    borderTop: 0,
    paddingTop: 0,
    overflowY: 'scroll',
    minWidth: '26rem',
    maxWidth: '100%',
    gap: 0,
  },
})

export const UserDetailsContainer = styled('div', {
  alignItems: 'flex-start',
  flexDirection: 'column',
  width: '100%',
  overflow: 'scroll',

  '@media (min-width: 1024px)': {
    alignItems: 'center',
    maxHeight: '80vh',
    padding: '1rem',
    marginTop: 0,
  },

  '@media (min-width: 1200px)': {
    height: '100vh',
  },
})

export const EmptyWrapper = styled('div', {
  marginTop: '2rem',
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  width: '100%',
  gap: '1.5rem',

  '@media (min-width: 1024px)': {
    height: '100%',
    paddingBottom: '4rem',
    minWidth: '27rem',
  },

  '@media (min-width: 1200px)': {
    justifyContent: 'flex-start',
  },
})

export const UserRatings = styled('div', {
  marginTop: '2rem',
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  width: '100%',
  gap: '1rem',

  '@media (min-width: 768px)': {
    '&.with_padding_right': {
      paddingRight: '1rem',
    },
  },

  '@media (min-width: 1024px)': {
    overflowY: 'scroll',
    maxHeight: '64vh',
    minWidth: '27rem',
  },

  '@media (min-width: 1200px)': {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
})

export const UserRatingsTitle = styled('p', {
  fontSize: '$sm',
  marginBottom: '0.5rem',
})
