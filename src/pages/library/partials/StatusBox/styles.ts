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

  '&.smaller': {
    paddingRight: '1.5rem',
  },

  '@media (min-width: 480px)': {
    padding: '1.5rem 0 1.5rem 2rem',

    '&.smaller': {
      paddingRight: '2rem',
    },
  },

  '@media (min-width: 768px)': {
    padding: '1.5rem 0 1.5rem 1.2rem',

    '&.smaller': {
      paddingRight: '2rem',
    },
  },

  '@media (min-width: 1024px)': {
    marginBottom: '3rem',
    padding: 0,

    '&.smaller': {
      paddingRight: 0,

      '*::-webkit-scrollbar': {
        width: 2,
        height: 0,
      },
    },

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
  padding: '1.2rem 0 1.2rem 1.2rem',
  width: '100%',
  gap: '1.2rem',
  overflowX: 'scroll',
  background: '$gray700',
  borderRadius: 8,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

  '&.smaller': {
    padding: '1.2rem',
  },

  '@media (min-width: 680px)': {
    gap: '1.5rem',
  },

  '@media (min-width: 1024px)': {
    gap: '1.8rem',
  },

  '@media (min-width: 1200px)': {
    padding: '1.8rem',
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
  cursor: 'pointer',
  width: '5.45rem',
  height: 'auto',
  borderRadius: 8,
  opacity: 0.9,
  filter: 'brightness(0.95)',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

  '@media (min-width: 680px)': {
    width: '6rem',
  },

  '&:hover': {
    filter: 'brightness(1.15)',
    transition: '200ms',
  },
})

export const EmptyBookCover = styled('div', {
  cursor: 'pointer',
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

  '&:hover': {
    border: '1px dashed $gray200',
    transition: '200ms',

    svg: {
      color: '$gray200',
    },
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
