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
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
  gap: '1.5rem',

  '@media (min-width: 580px)': {
    width: '100%',
    gap: '2rem',
  },
})

export const BookCover = styled('img', {
  width: 90,
  height: 'auto',
  borderRadius: 8,
  boxShadow:
    '0px 6px 12px rgba(0, 0, 0, 0.6), 0px 3px 6px rgba(255, 255, 255, 0.15)',
  opacity: 0.9,

  '@media (min-width: 480px)': {
    width: 105,
  },

  '@media (min-width: 580px)': {
    width: 120,
  },
})

export const BookInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  height: '100%',
  width: '100%',
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
  alignItems: 'flex-start',
  textAlign: 'left',

  h2: {
    fontSize: '0.95rem',
    maxHeight: '4.5rem',
    whiteSpace: 'break-spaces',
    overflow: 'scroll',
    position: 'relative',
  },

  p: {
    color: '$gray300',
    fontSize: '0.8rem',
  },

  '@media (min-width: 480px)': {
    h2: {
      fontSize: '1rem',
    },

    p: {
      fontSize: '0.9rem',
    },
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
    textAlign: 'left',

    h2: {
      fontSize: '1.5rem',
      maxHeight: '100%',
    },

    p: {
      color: '$gray300',
      fontSize: '1.1rem',
    },
  },
})

export const BookSummary = styled('div', {
  maxHeight: '6.5rem',
  position: 'relative',
  overflow: 'scroll',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',

  p: {
    color: '$gray300',
    lineHeight: '1.4rem',
    fontSize: '0.875rem',
    wordBreak: 'break-word',
    paddingRight: '0.3rem',
  },
})

export const Footer = styled('footer', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '1rem',

  '@media (min-width: 480px)': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
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

  '@media (min-width: 480px)': {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0.5rem',

    svg: {
      fontSize: '1.7rem',
    },
  },

  '@media (min-width: 680px)': {
    svg: {
      fontSize: '1.9rem',
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

  '@media (min-width: 480px)': {
    alignItems: 'center',
    textAlign: 'center',
  },

  '@media (min-width: 680px)': {
    h2: {
      fontSize: '1.1rem',
      color: '$white',
    },
  },
})

export const RatingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.3rem',
  width: '100%',

  p: {
    color: '$gray200',
    fontSize: '0.85rem',
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',

    p: {
      fontSize: '0.9rem',
    },
  },
})

export const Separator = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: '$gray600',
  margin: '1rem 0',
})
