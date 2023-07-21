import { styled } from '../../../styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
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

  '@media (min-width: 1024px)': {
    marginTop: '1.5rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
})

export const UserDetailsContainer = styled('div', {
  alignItems: 'flex-start',
  flexDirection: 'column',
})
