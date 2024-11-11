import { styled } from '@/styles'

export const Container = styled('div', {
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  padding: '1.65rem 1rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'stretch',
  width: '100%',
  gap: '1rem',

  '&:hover': {
    backgroundColor: '$gray600',
    transition: '200ms ease-in-out',
  },
})

export const BookCover = styled('img', {
  width: '6.75rem',
  height: 'auto',
  borderRadius: 8,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',
  opacity: 0.9,
})

export const BookInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
})

export const BookData = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.2rem',

  h2: {
    fontSize: '0.95rem',
    maxHeight: '4.5rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
    width: '90%',
  },

  p: {
    color: '$gray400',
    fontSize: '0.88rem',
  },

  '@media (min-width: 480px)': {
    h2: {
      fontSize: '0.98rem',
    },

    p: {
      fontSize: '0.9rem',
    },
  },
})

export const InfosContainer = styled('div', {
  marginTop: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.2rem',

  p: {
    color: '$gray400',
    fontSize: '0.8rem',
  },
})
