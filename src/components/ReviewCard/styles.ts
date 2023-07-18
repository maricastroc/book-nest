import { styled } from '../../styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem 2rem 1rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '35rem',
})

export const Header = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  width: '100%',
  marginBottom: '1.5rem',

  '@media (min-width: 580px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
})

export const UserInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  width: '100%',

  '@media (min-width: 580px)': {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
})

export const NameAndDate = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.1rem',

  span: {
    color: '$gray400',
    fontSize: '$sm',
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
  },
})

export const BookContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

export const BookCover = styled('img', {
  width: '6.75rem',
  height: 'auto',
  borderRadius: 8,
  marginTop: '2rem',
})

export const BookDetails = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '1.5rem',
})

export const BookInfo = styled('div', {
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
})

export const BookDescription = styled('div', {
  maxHeight: '6.5rem',
  position: 'relative',
  overflow: 'scroll',

  p: {
    color: '$gray300',
    lineHeight: '160%',
    fontSize: '$sm',
    wordBreak: 'break-word',
    paddingRight: '0.3rem',
  },
})

export const Separator = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: '$gray400',
  opacity: 0.4,
})
