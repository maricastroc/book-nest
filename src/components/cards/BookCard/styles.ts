import { styled } from '@/styles'

export const BookCardBox = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  padding: '1rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'stretch',
  gap: '0.7rem',
  width: '100%',
  position: 'relative',
  height: '10rem',

  '@media (min-width: 480px)': {
    height: '11.5rem',
    gap: '0.9rem',
    padding: '1.2rem',
  },

  '@media (min-width: 1200px)': {
    padding: '1.2rem',
  },

  '&:hover': {
    backgroundColor: '$gray600',
    transition: '200ms ease-in-out',
  },

  '&.smaller': {
    height: '10rem',

    '@media (min-width: 1024px)': {
      height: '9.2rem',
    },
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
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  width: '100%',
  textAlign: 'left',

  h2: {
    fontSize: '0.95rem',
    position: 'relative',
    width: '85%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  },

  p: {
    marginTop: '0.3rem',
    color: '$gray400',
    fontSize: '0.85rem',
  },

  '@media (min-width: 480px)': {
    h2: {
      fontSize: '0.98rem',
    },

    p: {
      marginTop: '0.3rem',
      fontSize: '0.9rem',
    },
  },

  '&.smaller': {
    h2: {
      fontSize: '0.9rem',
    },

    p: {
      fontSize: '0.82rem',
    },
  },
})

export const BookCover = styled('img', {
  width: '5.6rem',
  height: 'auto',
  borderRadius: 8,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',

  '&.smaller': {
    '@media (min-width: 480px)': {
      width: '5.5rem',
    },

    '@media (min-width: 1024px)': {
      width: '4.5rem',
    },
  },

  '@media (min-width: 480px)': {
    width: '6.5rem',
  },
})

export const FooterWrapper = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  width: '100%',
})

export const RatingWrapper = styled('div', {
  marginTop: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.4rem',

  p: {
    color: '$gray400',
    fontSize: '0.8rem',
  },

  '&.smaller': {
    gap: '0.05rem',
  },
})

export const ActionButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: 8,
  padding: '0.3rem',
  backgroundColor: 'transparent',

  svg: {
    fontSize: '1.2rem',
  },

  '&.edit': {
    border: '1px solid $green200',

    svg: {
      color: '$green100',
    },
  },

  '&.delete': {
    border: '1px solid $red400',

    svg: {
      color: '$red300',
    },
  },

  '&:hover': {
    filter: 'brightness(1.3)',
    transition: '200ms',
  },

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
      },
    },
  },
})
