import { styled } from '@/styles'

export const BookCardBox = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem 1.2rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'center',
  gap: '0.7rem',
  width: '100%',
  position: 'relative',
  height: '13.8rem',

  '@media (min-width: 480px)': {
    gap: '0.9rem',
  },

  '&:hover': {
    backgroundColor: '$gray600',
    transition: '200ms ease-in-out',
  },
})

export const BookContentWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  width: '100%',
})

export const BookTitleAndAuthor = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  textAlign: 'center',

  h2: {
    fontSize: '0.95rem',
    position: 'relative',
    width: '85%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  },

  p: {
    marginTop: '0.12rem',
    color: '$gray400',
    fontSize: '0.9rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  },

  '@media (min-width: 480px)': {
    h2: {
      fontSize: '0.9375rem',
    },
  },
})

export const BookCover = styled('img', {
  width: '5.5rem',
  height: '8rem',
  borderRadius: 8,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

  '@media (min-width: 380px)': {
    width: '6.2rem',
    height: '8.4rem',
  },

  '@media (min-width: 480px)': {
    width: '5.5rem',
    height: '7.8rem',
  },

  '@media (min-width: 540px)': {
    width: '6.2rem',
    height: '8.4rem',
  },
})
