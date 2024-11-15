import { styled } from '@/styles'

export const UserCardBox = styled('div', {
  display: 'flex',
  padding: '1.2rem 1rem 0.7rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'flex-start',
  gap: '1rem',
  position: 'relative',
  height: 'auto',
  overflowX: 'scroll',

  '@media (min-width: 680px)': {
    padding: '1.2rem 1.2rem 0.8rem',
  },
})

export const NameAndTime = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.12rem',

  h2: {
    fontSize: '0.95rem',
    position: 'relative',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  },

  time: {
    color: '$gray400',
    fontSize: '0.85rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    width: '100%',
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  },

  '@media (min-width: 680px)': {
    h2: {
      fontSize: '1rem',
    },

    time: {
      fontSize: '0.92rem',
    },
  },
})

export const UserContentWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  overflowX: 'scroll',
  height: '100%',
  width: 'auto',
})

export const LinksContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '0.4rem',

  a: {
    color: '$green100',
    fontSize: '0.85rem',
    textDecoration: 'none',
    fontWeight: 700,

    '&:hover': {
      filter: 'brightness(1.2)',
      transition: '200ms ease-in-out',
    },
  },

  p: {
    margin: '0 0.5rem',
    fontSize: '0.85rem',
    color: '$gray300',
  },

  '@media (min-width: 680px)': {
    a: {
      fontSize: '0.95rem',
    },

    p: {
      fontSize: '0.92rem',
    },
  },
})

export const AvatarContainer = styled('a', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 42,
  height: 42,
  borderRadius: '50%',

  '@media (min-width: 680px)': {
    width: 46,
    height: 46,
  },
})

export const AvatarDefault = styled('img', {
  overflow: 'hidden',
  objectFit: 'cover',
  borderRadius: '50%',
  width: 40,
  aspectRatio: 'auto 40 / 40',
  height: 40,

  outline: '1.5px solid $green100',
  outlineOffset: 2,

  '@media (min-width: 680px)': {
    width: 44,
    aspectRatio: 'auto 44 / 44',
    height: 44,
  },
})
