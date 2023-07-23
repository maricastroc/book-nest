import { styled } from '../../styles'

export const Container = styled('div', {
  display: 'flex',
  padding: '1.25rem',
  backgroundColor: '$gray600',
  borderRadius: 8,
  alignItems: 'stretch',
  gap: '1.25rem',
  width: '100%',
  position: 'relative',
  marginBottom: '1.5rem',
})

export const BookInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  width: '100%',

  '@media (min-width: 580px)': {
    flexDirection: 'column-reverse',
  },
})

export const TimeAndRating = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.3rem',

  time: {
    color: '$gray400',
    fontSize: '$sm',
  },

  '@media (min-width: 580px)': {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
  },
})

export const BookData = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
})

export const BookTitle = styled('div', {
  display: 'flex',
  marginTop: '1.5rem',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.2rem',

  h2: {
    fontSize: '1rem',
    minHeight: '1rem',
    maxHeight: '3.5rem',
    whiteSpace: 'break-spaces',
    overflow: 'scroll',
    position: 'relative',
  },

  p: {
    color: '$gray400',
    fontSize: '0.85rem',
  },
})

export const BookDescription = styled('div', {
  display: 'none',
  maxHeight: '2.8rem',
  marginTop: '1.5rem',
  position: 'relative',
  overflow: 'scroll',

  p: {
    color: '$gray300',
    lineHeight: '160%',
    fontSize: '$sm',
    wordBreak: 'break-word',
    paddingRight: '0.3rem',
  },

  '@media (min-width: 580px)': {
    display: 'block',
  },
})

export const BookCover = styled('img', {
  width: '5rem',
  height: 'auto',
  borderRadius: 8,

  '@media (min-width: 580px)': {
    width: '6.75rem',
  },
})
