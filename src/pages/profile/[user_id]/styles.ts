import { styled } from '../../../styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 768px)': {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: '97vh',
    padding: '0 2rem 0 1rem',
    gap: '3rem',
  },
})

export const ProfileContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '35rem',
  marginTop: '2rem',

  '@media (min-width: 768px)': {
    overflow: 'scroll',
    maxWidth: '100%',
    height: '100vh',
    paddingBottom: '2rem',
  },

  '@media (min-width: 1200px)': {
    height: '93vh',
    paddingBottom: 0,
  },
})

export const ProfileContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 768px)': {
    overflow: 'scroll',
    maxWidth: '100%',
    justifyContent: 'flex-start',
  },

  '@media (min-width: 1200px)': {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '2.5rem',
    maxHeight: '100vh',
    overflow: 'scroll',
  },
})

export const BooksSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  marginTop: '2.5rem',

  '@media (min-width: 768px)': {
    paddingRight: '1rem',
    justifyContent: 'flex-start',
  },
})

export const Heading = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  alignSelf: 'start',
  gap: '0.8rem',
  textAlign: 'left',
  marginBottom: '1rem',
  width: '100%',
})

export const HeadingTitle = styled('div', {
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

export const SearchBar = styled('div', {
  display: 'flex',
  backgroundColor: '$gray800',
  border: 'solid 1px $gray500',
  borderRadius: 8,
  padding: '0.875rem 1.25rem',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '25rem',

  input: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '$white',

    '&:focus': {
      boxShadow: 'none',
    },

    '&::placeholder': {
      color: '$gray400',
    },
  },

  svg: {
    fontSize: '1.2rem',
    color: '$gray500',
  },

  '&:has(input:focus)': {
    borderColor: '$green200',
    svg: {
      color: '$green200',
    },
  },

  '@media (min-width: 1024px)': {
    width: '60%',
    maxWidth: '25rem',
  },
})

export const BooksContainer = styled('div', {
  marginTop: '2rem',
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  width: '100%',
  gap: '1.5rem',

  '@media (min-width: 768px)': {
    paddingRight: '1rem',
  },

  '@media (min-width: 1200px)': {
    justifyContent: 'flex-start',
    overflow: 'scroll',
    height: '100vh',
  },
})

export const UserDetailsContainer = styled('div', {
  alignItems: 'flex-start',
  flexDirection: 'column',
  padding: '0 2rem',

  '@media (min-width: 1200px)': {
    borderLeft: '2px solid $gray700',
    width: '50%',
    height: '100vh',
    overflow: 'scroll',
  },
})
