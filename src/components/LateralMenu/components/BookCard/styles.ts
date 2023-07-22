import { styled } from '../../../../styles'

export const BookContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$gray700',
  padding: '1.5rem',
  borderRadius: 8,
  width: '100%',

  '@media (min-width: 580px)': {
    padding: '1.5rem 2rem',
  },
})

export const BookContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 580px)': {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: '2rem',
  },
})

export const BookCover = styled('img', {
  width: 171,
  height: 'auto',
  borderRadius: 8,
})

export const BookInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '1.5rem',
  gap: '1.5rem',

  '@media (min-width: 580px)': {
    flexDirection: 'flex-start',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100%',
    marginTop: 0,
  },
})

export const BookData = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',

  h2: {
    fontSize: '1rem',
    maxHeight: '4.5rem',
    whiteSpace: 'break-spaces',
    overflow: 'scroll',
    position: 'relative',
  },

  p: {
    color: '$gray300',
    fontSize: '0.9rem',
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
    textAlign: 'left',

    h2: {
      fontSize: '1.25rem',
    },

    p: {
      color: '$gray300',
      fontSize: '1rem',
    },
  },
})

export const Footer = styled('footer', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '1rem',

  '@media (min-width: 580px)': {
    flexDirection: 'row',
    gap: '4rem',
    width: '100%',
  },
})

export const FooterItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',

  svg: {
    fontSize: '1.5rem',
    color: '$green100',
  },

  '@media (min-width: 580px)': {
    svg: {
      fontSize: '1.7rem',
    },
  },
})

export const ItemText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  alignItems: 'flex-start',

  p: {
    fontSize: '$sm',
    color: '$gray300',
  },

  h2: {
    fontSize: '0.95rem',
    color: '$white',
  },

  '@media (min-width: 580px)': {
    h2: {
      fontSize: '1rem',
    },
  },
})

export const RatingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.2rem',

  p: {
    color: '$gray400',
    fontSize: '0.85rem',
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',

    p: {
      color: '$gray400',
      fontSize: '0.9rem',
    },
  },
})

export const Separator = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: '$gray600',
  margin: '1.5rem 0 2rem',
})
