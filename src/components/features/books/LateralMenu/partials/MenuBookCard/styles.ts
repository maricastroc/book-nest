import { styled } from '@/styles'

export const BookCardWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$gray700',
  padding: '1.5rem',
  borderRadius: 8,
  width: '100%',

  '@media (min-width: 580px)': {
    padding: '1.5rem 2rem',
  },
})

export const BookCardContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  gap: '1.5rem',

  '@media (min-width: 580px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: '2rem',
  },
})

export const BookCover = styled('img', {
  width: 120,
  height: 'auto',
  borderRadius: 8,
  opacity: 0.9,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

  '@media (min-width: 480px)': {
    width: 135,
  },

  '@media (min-width: 580px)': {
    width: 140,
  },
})

export const BookDetailsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
  width: '100%',
  gap: '1.5rem',

  '@media (min-width: 580px)': {
    flexDirection: 'flex-start',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100%',
    marginTop: 0,
  },
})

export const BookTitleAndAuthor = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',

  h2: {
    fontSize: '1.15rem',
    maxHeight: '4.5rem',
    whiteSpace: 'break-spaces',
    overflow: 'scroll',
    position: 'relative',
  },

  p: {
    color: '$gray300',
    fontSize: '0.95rem',
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
    textAlign: 'left',

    h2: {
      fontSize: '1.5rem',
      maxHeight: '100%',
    },

    p: {
      color: '$gray300',
      fontSize: '1.1rem',
    },
  },
})

export const BookOtherInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
})

export const BookRatingInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',

  p: {
    color: '$gray100',
    fontSize: '0.95rem',
    fontWeight: 700,
  },
})

export const BookRatingAndReviews = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.6rem',

  p: {
    color: '$gray300',
    fontSize: '0.85rem',
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',

    p: {
      fontSize: '0.9rem',
    },
  },
})

export const DividerLine = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: '$gray600',
  margin: '1rem 0',
})

export const AddToLibrarySection = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '0.5rem',
})

export const AddToLibraryButton = styled('button', {
  color: '$green100',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '0.5rem',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: '1px solid $green100',
  fontSize: '0.9rem',

  '&:not(:disabled):hover': {
    backgroundColor: '$green200',
    transition: 'all 200ms',
    border: '1px solid $green200',
    color: '$gray100',
  },

  '&:disabled': {
    backgroundColor: '$gray400',
    cursor: 'not-allowed !important',
    border: '1px solid $gray400',
    color: '$gray100',
  },
})

export const UserInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  gap: '0.7rem',
})

export const UserInfoText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fontSize: '0.78rem',
  color: '$gray400',

  p: {
    fontSize: '0.85rem',
    color: '$gray300',
  },

  strong: {
    color: '$gray200',
  },
})
