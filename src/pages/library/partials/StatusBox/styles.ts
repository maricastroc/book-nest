import { styled } from '@/styles'

export const LibraryContainerBox = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: '1.5rem 0 1.5rem 1.5rem',
  marginRight: '-1rem',
  width: '100%',
  marginBottom: '0.5rem',
  gap: '0.7rem',

  '@media (min-width: 480px)': {
    marginBottom: '3rem',
  },

  '@media (min-width: 1024px)': {
    padding: 0,

    '*::-webkit-scrollbar': {
      width: 2,
      height: 8,
    },

    '*::-webkit-scrollbar-thumb': {
      backgroundColor: '$gray600',
      boxShadow: 'inset 0 0 0px 6px $gray600',
    },
  },
})

export const TagStatus = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '0.7rem',
  fontWeight: 600,
  borderRadius: 15,
  color: '$gray300',

  svg: {
    color: '$green100',
    fontSize: '1.05rem',
  },

  '&.reading': {
    svg: {
      color: '#ca4036',
    },
  },

  '&.read': {
    svg: {
      color: '$green100',
    },
  },

  '&.want_to_read': {
    svg: {
      color: '#c64a96',
    },
  },

  '&.did_not_finish': {
    svg: {
      color: '#cc803d',
    },
  },
})

export const ContainerWrapper = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: '1.5rem 0 1.5rem 1.5rem',
  width: '100%',
  gap: '1.45rem',
  overflowX: 'scroll',
  background: '$gray750',
  borderRadius: 8,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

  '&.empty': {
    padding: '1.5rem',
  },

  '@media (min-width: 1024px)': {
    gap: '1.8rem',
  },
})

export const BookDetailsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: '$gray300',
  width: '4.8rem',

  p: {
    marginTop: '0.5rem',
    fontWeight: 600,
    fontSize: '0.8rem',
    position: 'relative',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  },

  h2: {
    marginTop: '0.1rem',
    fontWeight: 900,
    fontSize: '0.7rem',
    position: 'relative',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
    textTransform: 'uppercase',
  },
})

export const BookContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '0.05rem',
  textAlign: 'center',
  height: '100%',
})

export const BookCover = styled('img', {
  width: '5rem',
  height: 'auto',
  borderRadius: 8,
  opacity: 0.9,
  filter: 'brightness(0.95)',

  '@media (min-width: 1200px)': {
    width: '5.5rem',
  },
})

export const EmptyBookCover = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px dashed $gray400',
  minWidth: '4.8rem',
  marginRight: '1.5rem',
  height: '7rem',
  borderRadius: 8,
  opacity: 0.9,
  filter: 'brightness(0.95)',

  '@media (min-width: 480px)': {
    minWidth: '5.2rem',
  },

  '@media (min-width: 1200px)': {
    height: '7.8rem',
  },

  svg: {
    color: '$gray400',
    fontSize: '1.5rem',
  },
})

export const EmptyBooksContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  height: '7rem',
  borderRadius: 8,
  opacity: 0.9,
  filter: 'brightness(0.95)',

  p: {
    fontSize: '0.9rem',
    lineHeight: '1.3rem',
    color: '$gray400',
    textAlign: 'left',
    width: '10rem',
  },

  '@media (min-width: 480px)': {
    p: {
      fontSize: '0.95rem',
      width: '15rem',
    },
  },

  '@media (min-width: 1200px)': {
    height: '7.8rem',
  },
})
