import { styled } from '../../styles'

export const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '100vh',

  '@media (min-width: 768px)': {
    flexDirection: 'row',
    height: '97vh',
    alignItems: 'stretch',
    padding: '0 2rem 0 1rem',
    gap: '5rem',
  },

  '@media (min-width: 1024px)': {
    paddingRight: '5rem',
  },
})

export const ExploreContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '35rem',
  marginTop: '2rem',

  '@media (min-width: 768px)': {
    alignItems: 'flex-start',
    padding: '0 0 0 2rem',
    maxWidth: '45rem',
  },

  '@media (min-width: 1200px)': {
    maxWidth: '100%',
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

export const ExploreContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 768px)': {
    justifyContent: 'flex-start',
    overflowY: 'scroll',
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

export const Categories = styled('div', {
  marginTop: '2.5rem',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.7rem',
  alignItems: 'center',
  width: '100%',
})

export const ButtonFilter = styled('button', {
  cursor: 'pointer',
  backgroundColor: 'transparent',
  borderRadius: 16,
  border: 'solid 1px $purple100',
  color: '$purple100',
  padding: '0.4rem 1rem',
  fontSize: '0.95rem',

  variants: {
    selected: {
      true: {
        border: 'solid 1px $purple200',
        backgroundColor: '$purple200',
        color: '$white',
      },
    },
  },
})

export const BooksContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1.5rem',
  marginTop: '2rem',
  width: '100%',
  marginBottom: '2rem',

  '@media (min-width: 980px)': {
    gridTemplateColumns: '1fr 1fr',
    paddingRight: '1rem',
  },

  '@media (min-width: 1400px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
})
