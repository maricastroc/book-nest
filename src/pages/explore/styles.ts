import { styled } from '@/styles'

export const ExplorePageWrapper = styled('div', {
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
  paddingBottom: '3rem',

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
    paddingLeft: '15.2rem',
  },

  '@media (min-width: 980px)': {
    paddingLeft: '18rem',
    gap: '5rem',
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
    marginTop: '2rem',
    padding: 0,
  },

  '@media (min-width: 980px)': {
    paddingLeft: '1rem',
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

export const ExplorePageContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: '3rem',

  '@media (min-width: 768px)': {
    paddingRight: '1rem',
    justifyContent: 'flex-start',
    overflowY: 'scroll',
  },
})

export const Categories = styled('div', {
  marginTop: '1rem',
  display: 'flex',
  overflowX: 'scroll',
  gap: '0.7rem',
  alignItems: 'center',
  width: '100%',
  padding: '0 1.8rem 0.8rem',

  '&::-webkit-scrollbar': {
    display: 'none',
  },

  '@media (min-width: 1024px)': {
    paddingBottom: '1.2rem',
  },
})

export const SelectCategoryButton = styled('button', {
  cursor: 'pointer',
  backgroundColor: 'transparent',
  borderRadius: 16,
  border: 'solid 1px $purple100',
  color: '$purple100',
  padding: '0.4rem 1rem',
  fontSize: '0.95rem',
  whiteSpace: 'nowrap',

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
})

export const BooksContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  width: '100%',
  marginBottom: '2rem',

  '@media (min-width: 420px)': {
    gap: '1.5rem',
  },

  '@media (min-width: 480px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },

  '@media (min-width: 910px)': {
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
  },

  '@media (min-width: 1200px)': {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
  },

  '@media (min-width: 1400px)': {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
  },
})

export const ScrollContainer = styled('div', {
  position: 'relative',
  width: '100%',
})

export const CaretRightIcon = styled('div', {
  position: 'absolute',
  cursor: 'pointer',
  right: 0,
  top: '52%',
  transform: 'translateY(-50%)',
  zIndex: 997,
  color: '$gray100',
  width: '2rem',
  height: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.9,
  transition: 'all 0.2s',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',

  '&:hover': {
    opacity: 1,
    transform: 'translateY(-50%) scale(1.1)',
  },

  '@media (min-width: 1024px)': {
    right: 0,
    top: '48%',
  },
})

export const CaretLeftIcon = styled('div', {
  position: 'absolute',
  cursor: 'pointer',
  left: 0,
  top: '52%',
  transform: 'translateY(-50%)',
  zIndex: 997,
  color: '$gray100',
  width: '2rem',
  height: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.7,
  transition: 'all 0.2s',
  boxShadow: '0 2px 4px rgba(73, 73, 73, 0.1)',

  '&:hover': {
    opacity: 1,
    transform: 'translateY(-50%) scale(1.1)',
  },

  '@media (min-width: 1024px)': {
    right: 0,
    top: '48%',
  },
})
