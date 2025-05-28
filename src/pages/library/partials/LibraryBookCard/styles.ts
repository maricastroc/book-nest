import { styled } from '@/styles'

export const BookCardBox = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 8,
  alignItems: 'center',
  gap: '0.7rem',
  position: 'relative',
  height: '13rem',
})

export const BookContentWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

export const BookTitleAndAuthor = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  textAlign: 'center',
  maxWidth: '6.3rem',

  h2: {
    fontSize: '0.85rem',
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
    fontSize: '0.82rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  },
})

export const BookCover = styled('img', {
  width: '5.2rem',
  height: '7.5rem',
  borderRadius: 8,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

  '&:hover': {
    filter: 'brightness(1.4)',
    transition: '200ms all',
  },
})
