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
  height: '100%',

  '@media (min-width: 680px)': {
    alignItems: 'stretch',
  },

  '@media (min-width: 768px)': {
    padding: '1.5rem',
    paddingRight: '1rem',
    alignItems: 'center',
  },
})

export const BookInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  width: '100%',

  '@media (min-width: 580px)': {
    flexDirection: 'column-reverse',
    height: '100%',
    alignItems: 'space-between',
  },
})

export const TimeAndRating = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.3rem',

  time: {
    display: 'none',
  },

  '@media (min-width: 580px)': {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
  },

  '@media (min-width: 480px)': {
    time: {
      display: 'block',
      color: '$gray400',
      fontSize: '$sm',
    },
  },
})

export const BookData = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  height: '100%',
  overflow: 'scroll',
})

export const BookTitle = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.1rem',

  h2: {
    fontSize: '0.9rem',
    minHeight: '1rem',
    maxHeight: '4rem',
    whiteSpace: 'break-spaces',
    overflow: 'scroll',
    position: 'relative',
  },

  p: {
    color: '$gray400',
    fontSize: '0.85rem',
  },

  '@media (min-width: 580px)': {
    marginTop: '0.5rem',
  },

  '@media (min-width: 680px)': {
    h2: {
      fontSize: '1rem',
    },
  },
})

export const BookDescription = styled('div', {
  display: 'none',
  marginTop: '1.5rem',
  position: 'relative',

  p: {
    color: '$gray300',
    lineHeight: '160%',
    fontSize: '$sm',
    wordBreak: 'break-word',
    paddingRight: '0.3rem',
  },

  '@media (min-width: 580px)': {
    maxHeight: '3.2rem',
    marginTop: '1rem',
    display: 'block',
  },

  '@media (min-width: 980px)': {
    maxHeight: '5rem',
  },
})

export const BookCover = styled('img', {
  width: '5rem',
  height: 'auto',
  borderRadius: 8,
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.6), 0px 3px 6px rgba(255, 255, 255, 0.15)',

  '@media (min-width: 580px)': {
    width: '6.5rem',
  },
})
