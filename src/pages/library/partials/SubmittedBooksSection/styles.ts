import { styled } from '@/styles'

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
    height: '100vh',

    maxWidth: '100%',
    minWidth: '12rem',
    paddingBottom: 0,
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
})

export const DividerLine = styled('span', {
  width: 30,
  background: '$gradient-horizontal',
  borderRadius: 8,
  height: 4,
  margin: '1.8rem 0',
})

export const EditProfileButton = styled('button', {
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.7rem',
  cursor: 'pointer',
  color: '$green100',
  padding: '0.3rem',
  fontSize: '0.85rem',
  borderRadius: 10,
  border: 'solid 1px $green100',
  width: '7rem',
  marginTop: '1rem',

  svg: {
    color: '$green100',
  },

  '&:hover': {
    backgroundColor: '$green200',
    color: '#FFFFFF',
    transition: '200ms',
    border: 'solid 1px $green200',

    svg: {
      color: '#FFFFFF',
    },
  },

  '&:focus': {
    outline: '1px solid $green200',
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
})
