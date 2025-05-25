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
  maxWidth: '30rem',

  '@media (min-width: 768px)': {
    margin: '0 auto',
  },

  '@media (min-width: 1024px)': {
    minHeight: '100%',
    overflowY: 'scroll',
    maxWidth: '100%',
    minWidth: '12rem',
    paddingBottom: '2rem',
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

  '@media (min-width: 768px)': {
    width: '85%',
  },
})

export const SubmittedBooksHeading = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  p: {
    color: 'gray$200',
    fontSize: '0.95rem',
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
  width: '85%',
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
