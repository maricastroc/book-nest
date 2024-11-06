import { styled } from '@/styles'

export const ProfileCardBox = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  gap: '0.8rem',
})

export const ProfileCardHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  time: {
    color: '$gray400',
    fontSize: '$sm',
    width: '100%',
  },
})

export const ProfileCardBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',

  '@media (min-width: 480px)': {
    padding: '2rem',
  },
})

export const BookDetailsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  '@media (min-width: 980px)': {
    flexDirection: 'row',
    gap: '1.5rem',
  },
})

export const BookDetailsContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  width: '100%',

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
  },
})

export const BookInfoSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: '1rem',

  '@media (min-width: 580px)': {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'stretch',
    textAlign: 'left',
  },
})

export const BookCover = styled('img', {
  width: '6.5rem',
  height: 'auto',
  borderRadius: 8,
  boxShadow:
    '0px 6px 12px rgba(0, 0, 0, 0.6), 0px 3px 6px rgba(255, 255, 255, 0.15)',
})

export const BookInfoHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',

  '@media (min-width: 580px)': {
    justifyContent: 'space-between',
    minHeight: '100%',
    alignItems: 'flex-start',
  },
})

export const BookTitleAndAuthor = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.2rem',

  h2: {
    fontSize: '$md',
  },

  p: {
    color: '$gray400',
    fontSize: '$sm',
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
  },
})

export const ReviewTextContainer = styled('div', {
  maxHeight: '6.5rem',
  position: 'relative',
  overflow: 'scroll',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',

  p: {
    color: '$gray300',
    lineHeight: '160%',
    fontSize: '$sm',
    wordBreak: 'break-word',
    paddingRight: '0.3rem',
  },
})

export const DividerLine = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: 'rgba(131, 129, 217, 0.7)',
  opacity: 0.4,
})
