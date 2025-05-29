import { styled } from '@/styles'

export const LibraryContainerBox = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: '1.2rem 0 1.5rem',
  marginRight: '-1rem',
  width: '100%',
  marginBottom: '0.5rem',
  gap: '0.7rem',
  overflowX: 'scroll',

  '&.smaller': {
    paddingRight: '1.5rem',
  },

  '@media (min-width: 480px)': {
    padding: '1.5rem 0 1.5rem',

    '&.smaller': {
      paddingRight: '2rem',
    },
  },

  '@media (min-width: 768px)': {
    padding: '1.5rem 0 1.5rem 0',

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
  },
})

export const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
})

export const ViewAllButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '$sm',
  color: '$purple100',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',

  svg: {
    fontSize: '1rem',
    color: '$purple100',
    marginLeft: '0.4rem',
  },

  '&:hover': {
    filter: 'brightness(1.4)',
    transition: '200ms all',
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

export const ScrollContainer = styled('div', {
  position: 'relative',
  width: '100%',
})

export const ContainerWrapper = styled('div', {
  display: 'flex',
  gap: '1.2rem',
  overflowX: 'auto',
  padding: '1.5rem 1.5rem 1.2rem 1.5rem',
  background: '$gray700',
  borderRadius: 8,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

  '&.smaller': {
    padding: '1.2rem',
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
  width: '5.4rem',
  height: '8.2rem',
  borderRadius: 8,
  opacity: 0.9,
  filter: 'brightness(0.95)',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

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
  width: '5.45rem',
  height: '8.5rem',
  marginRight: '1.5rem',
  borderRadius: 8,
  opacity: 0.9,
  filter: 'brightness(0.95)',

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
