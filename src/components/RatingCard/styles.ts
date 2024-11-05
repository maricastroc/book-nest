import { styled } from '@/styles'

export const RatingCardBox = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'space-between',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  height: '100%',

  '@media (min-width: 480px)': {
    alignItems: 'space-between',
  },
})

export const RatingCardHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  width: '100%',
  marginBottom: '1rem',

  '@media (min-width: 480px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
})

export const UserDetailsWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',

  '@media (min-width: 480px)': {
    alignItems: 'flex-start',
  },
})

export const UserDetailsHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',

  '@media (min-width: 480px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
})

export const UserNameDateWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: '0.1rem',
  fontSize: '0.9rem',

  time: {
    color: '$gray400',
    fontSize: '$sm',
  },
})

export const BookContentWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '100%',
})

export const BookDetailsContainer = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  gap: '1.5rem',
  margin: '1rem 0',

  '@media (min-width: 480px)': {
    margin: '1rem 0 0',
    alignItems: 'center',
  },
})

export const BookCover = styled('img', {
  width: '5rem',
  height: 'auto',
  borderRadius: 8,
  boxShadow:
    '0px 6px 12px rgba(0, 0, 0, 0.6), 0px 3px 6px rgba(255, 255, 255, 0.15)',

  '@media (min-width: 480px)': {
    width: '6.5rem',
  },
})

export const BookSummaryWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '1rem',

  '@media (min-width: 480px)': {
    gap: '0.5rem',
  },
})

export const BookTitleAndAuthor = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '0.2rem',

  h2: {
    fontSize: '0.95rem',
  },

  p: {
    color: '$gray400',
    fontSize: '$sm',
  },

  '@media (min-width: 480px)': {
    alignItems: 'flex-start',
    marginTop: '0.2rem',
  },
})

export const RatingContainer = styled('div', {
  display: 'flex',
  marginTop: '1rem',
  maxHeight: '6.5rem',
  height: '100%',
  position: 'relative',
  overflow: 'scroll',

  p: {
    color: '$gray300',
    lineHeight: '160%',
    fontSize: '0.85rem',
    wordBreak: 'break-word',
    paddingRight: '0.3rem',
  },

  '@media (min-width: 480px)': {
    marginTop: 0,
    minHeight: '6.3rem',
    alignItems: 'flex-end',
  },
})

export const DividerLine = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: '$gray500',
  opacity: 0.7,

  '@media (min-width: 480px)': {
    display: 'none',

    '&.larger': {
      display: 'block',
    },
  },
})
