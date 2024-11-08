import { styled } from '@/styles'

export const ProfilePageWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  maxWidth: '100vw',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 480px)': {
    padding: '0 2rem',
  },

  '@media (min-width: 768px)': {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'flex-start',
    padding: '0 2rem 0 1rem',
    paddingLeft: '18rem',
  },

  '@media (min-width: 1024px)': {
    gap: '3rem',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    height: '100vh',
    paddingLeft: '19rem',
  },

  '@media (min-width: 1200px)': {
    paddingLeft: '21rem',
  },

  '@media (min-width: 1800px)': {
    minWidth: 'auto',
    maxWidth: '80rem',
    margin: '0 auto',
  },
})

export const ProfilePageContainer = styled('div', {
  display: 'flex',
  width: '100%',
  gap: '2.5rem',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  maxHeight: '100%',
  padding: '1rem',
  paddingTop: '2rem',
  maxWidth: '42rem',

  '@media (min-width: 480px)': {
    padding: '1.5rem',
  },

  '@media (min-width: 768px)': {
    padding: '1.5rem 0',
  },

  '@media (min-width: 980px)': {
    marginTop: '0.5rem',
    padding: '1.5rem',
  },

  '@media (min-width: 1024px)': {
    maxWidth: '100%',
    justifyContent: 'flex-start',
    padding: '1.5rem 0',
    gap: '1rem',
  },
})

export const ProfilePageContent = styled('div', {
  display: 'flex',
  flexDirection: 'column-reverse',
  padding: 0,
  width: '100%',
  gap: 0,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',

  '@media (min-width: 1024px)': {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    height: '100%',
    padding: '0 1.25rem 0 0',
  },
})

export const ProfilePageHeading = styled('div', {
  display: 'none',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  alignSelf: 'start',
  gap: '0.8rem',
  textAlign: 'left',
  marginBottom: '1rem',
  width: '100%',

  '@media (min-width: 1024px)': {
    display: 'flex',
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
  minHeight: '100%',
  borderTop: 'solid 2px $gray700',
  paddingTop: '2rem',

  '@media (min-width: 1024px)': {
    borderTop: 0,
    paddingTop: 0,
    overflowY: 'scroll',
    minWidth: '26rem',
    maxWidth: '100%',
    gap: 0,
  },

  '@media (min-width: 1200px)': {
    maxWidth: '50rem',
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
    paddingBottom: '5rem',
    marginTop: '-2.5rem',
  },

  '@media (min-width: 1200px)': {
    height: '100vh',
    overflow: 'scroll',
  },
})

export const SearchBar = styled('div', {
  display: 'flex',
  backgroundColor: '$gray800',
  border: 'solid 1px $green200',
  borderRadius: 8,
  padding: '0.875rem 1.25rem',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',

  input: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '$white',
    width: '100%',
    fontSize: '0.9rem',

    '&:has(input:focus)': {
      borderColor: '$green200',
    },

    '&:focus': {
      boxShadow: 'none',
      outline: 'none',
      padding: 'none',
      border: 'none',
    },

    '&::placeholder': {
      color: '$gray400',
    },
  },

  svg: {
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '$green200',
  },

  '&:has(input:focus)': {
    borderColor: '$green100',
    svg: {
      color: '$green100',
    },
  },

  '@media (min-width: 1024px)': {
    width: '100%',
    maxWidth: '100%',
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
  gap: '1.5rem',

  '@media (min-width: 768px)': {
    '&.smaller': {
      paddingRight: '1rem',
    },
  },

  '@media (min-width: 1024px)': {
    overflowY: 'scroll',
    height: '100vh',
    paddingBottom: '16rem',
    minWidth: '27rem',
  },

  '@media (min-width: 1200px)': {
    justifyContent: 'flex-start',
  },
})

export const UserRatingsTitle = styled('p', {
  fontSize: '$sm',
  marginBottom: '0.5rem',
})
