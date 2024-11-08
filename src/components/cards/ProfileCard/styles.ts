import { styled } from '@/styles'

export const ProfileCardWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.5rem',

  time: {
    color: '$gray400',
    fontSize: '$sm',
  },
})

export const ProfileCardBox = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'space-between',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  marginBottom: '2rem',

  '@media (min-width: 480px)': {
    alignItems: 'space-between',
  },
})

export const ProfileCardHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  marginBottom: '1rem',
  padding: '1.5rem 1.5rem 1.2rem',
  backgroundColor: '$gray650',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.1)',

  '@media (min-width: 480px)': {
    marginBottom: '0.5rem',
  },
})

export const ProfileCardBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '1.5rem',
  paddingTop: 0,
  width: '100%',
})

export const BookDetailsContainer = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  gap: '1rem',
  margin: '1rem 0',

  '@media (min-width: 480px)': {
    margin: '1rem 0 0',
    gap: '1.5rem',
  },
})

export const BookCover = styled('img', {
  width: '5.8rem',
  height: 'auto',
  borderRadius: 8,
  boxShadow:
    '0px 6px 12px rgba(0, 0, 0, 0.6), 0px 3px 6px rgba(255, 255, 255, 0.15)',

  '@media (min-width: 480px)': {
    width: '6.5rem',
    marginTop: '1rem',
  },
})

export const BookSummaryWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '1rem',

  '@media (min-width: 480px)': {
    gap: '0.5rem',
  },
})

export const BookTitleAndAuthor = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '0.2rem',

  h2: {
    fontSize: '0.95rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  },

  p: {
    color: '$gray400',
    fontSize: '$sm',
  },

  '@media (min-width: 480px)': {
    h2: {
      fontSize: '1rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      whiteSpace: 'normal',
    },

    alignItems: 'flex-start',
    marginTop: '0.2rem',
  },
})

export const RatingContainer = styled('div', {
  display: 'flex',
  marginTop: '1rem',
  height: '100%',
  position: 'relative',
  overflow: 'scroll',

  p: {
    color: '$gray300',
    lineHeight: '160%',
    fontSize: '0.85rem',
    wordBreak: 'break-word',
    paddingRight: '0.3rem',
  },

  '@media (min-width: 480px)': {
    marginTop: 0,
    minHeight: '6.3rem',
  },
})

export const DividerLine = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: 'rgba(80, 178, 192, 0.3)',
  opacity: 0.7,
  marginBottom: '0.8rem',

  '&.larger': {
    marginBottom: 0,
  },

  '@media (min-width: 480px)': {
    display: 'none',
    marginBottom: 0,

    '&.larger': {
      display: 'block',
    },
  },
})
