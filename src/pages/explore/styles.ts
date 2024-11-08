import { styled } from '@/styles'

export const ExplorePageWrapper = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  maxWidth: '100%',
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: '100vh',
  overflorX: 'hidden',
  minWidth: '100vw',

  '@media (min-width: 980px)': {
    flexDirection: 'row',
    height: '97vh',
    alignItems: 'stretch',
    padding: '0 2rem 0 1rem',
    gap: '2.5rem',
    paddingRight: '2rem',
    paddingLeft: '18rem',
  },

  '@media (min-width: 1024px)': {
    gap: '5rem',
    paddingLeft: '18rem',
  },
})

export const ExplorePageContainer = styled('div', {
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
  },

  '@media (min-width: 980px)': {
    marginTop: '0.5rem',
  },
})

export const ExplorePageHeading = styled('div', {
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

export const ExplorePageContent = styled('div', {
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

export const SearchBar = styled('div', {
  display: 'flex',
  backgroundColor: '$gray800',
  border: 'solid 1px $green200',
  borderRadius: 8,
  padding: '0.7rem 1.25rem',
  marginTop: '0.5rem',
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

  '@media (min-width: 480px)': {
    padding: '0.875rem 1.25rem',
    marginTop: 0,
  },

  '@media (min-width: 1024px)': {
    width: '60%',
    maxWidth: '25rem',
  },
})

export const Categories = styled('div', {
  marginTop: '1rem',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.7rem',
  alignItems: 'center',
  width: '100%',
})

export const SelectCategoryButton = styled('button', {
  cursor: 'pointer',
  backgroundColor: 'transparent',
  borderRadius: 16,
  border: 'solid 1px $purple100',
  color: '$purple100',
  padding: '0.3rem 0.8rem',
  fontSize: '0.85rem',

  '&:hover': {
    transition: '200ms',
    border: 'solid 1px $purple300',
    backgroundColor: '$purple300',
    color: '$white',
  },

  '&.loading': {
    cursor: 'not-allowed',
    opacity: 0.7,

    '&:hover': {
      backgroundColor: 'transparent',
      border: 'solid 1px $purple100',
      color: '$purple100',
      opacity: 0.7,
    },
  },

  variants: {
    selected: {
      true: {
        border: 'solid 1px $purple300',
        backgroundColor: '$purple300',
        color: '$white',
      },
    },
  },

  '@media (min-width: 768px)': {
    padding: '0.4rem 1rem',
    fontSize: '0.95rem',
  },
})

export const BooksContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '2rem',
  marginTop: '2rem',
  width: '100%',
  marginBottom: '2rem',

  '@media (min-width: 480px)': {
    gap: '1.5rem',
  },

  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 1fr',
  },

  '@media (min-width: 1400px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
})
