import { styled } from '@/styles'

export const SkeletonContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  gap: '1rem',
  height: '100%',
  padding: '0 2rem',
})

export const SubmittedBooksSectionWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  margin: '2.5rem auto 0',
  paddingTop: '0.5rem',
  paddingBottom: '1.5rem',

  '@media (min-width: 768px)': {
    margin: '0 auto',
  },

  '@media (min-width: 1024px)': {
    marginBottom: '1.5rem',
  },

  '@media (min-width: 1200px)': {
    overflowY: 'scroll',
    maxWidth: '100%',
    minWidth: '12rem',
    alignItems: 'flex-start',
    maxHeight: '80vh',
    padding: '0.5rem 2rem 2rem',
    marginTop: '3.5rem',
  },
})

export const UserProfileInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  textAlign: 'center',

  h2: {
    position: 'relative',
    fontSize: '1.25rem',
    color: '$white',
  },

  time: {
    fontSize: '0.85rem',
    color: '$gray400',
  },
})

export const SubmittedBooksWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  gap: '1rem',
})

export const SubmittedBooksHeading = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  p: {
    color: 'gray$200',
    fontSize: '0.95rem',
  },
})

export const SubmittedBooksContent = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  minWidth: '100%',
  gap: '0.9rem',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 480px)': {
    gridTemplateColumns: '1fr 1fr',
  },

  '@media (min-width: 1024px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },

  '@media (min-width: 1200px)': {
    gridTemplateColumns: '1fr',
  },

  '@media (min-width: 1900px)': {
    gridTemplateColumns: '1fr 1fr',
  },
})

export const EmptyBooksContainer = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  height: '18rem',
  backgroundColor: 'transparent',
  borderRadius: 8,
  width: '100%',
  border: 'dashed 1px $gray400',

  svg: {
    fontSize: '2.5rem',
    marginBottom: '0.8rem',
    color: '$gray400',
  },

  '&:hover': {
    border: '1px dashed $gray200',
    transition: '200ms',

    svg: {
      color: '$gray200',
    },
  },

  '&.variant': {
    width: '100%',
    height: '9rem',
  },

  '&.disabled': {
    cursor: 'default',

    '&:hover': {
      border: 'dashed 1px $gray400',

      svg: {
        color: '$gray400',
      },
    },
  },

  '@media (min-width: 1024px)': {
    marginBottom: '6rem',
  },
})
