import { styled } from '../../styles'

export const Container = styled('div', {
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  padding: '1.5rem 1rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'stretch',
  width: '100%',
  gap: '1rem',

  '&:hover': {
    backgroundColor: '$gray600',
    transition: '200ms ease-in-out',
  },
})

export const BookCover = styled('img', {
  width: '6.75rem',
  height: 'auto',
  borderRadius: 8,
})

export const BookInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
})

export const BookData = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.2rem',

  h2: {
    fontSize: '1rem',
    maxHeight: '4.5rem',
    whiteSpace: 'break-spaces',
    overflow: 'scroll',
    position: 'relative',
  },

  p: {
    color: '$gray400',
    fontSize: '0.85rem',
  },
})

export const ReadNotice = styled('div', {
  display: 'flex',
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '0.2rem 0.5rem',
  fontSize: '$xs',
  borderRadius: '0 8px 0 8px',
  backgroundColor: '$green300',
  color: '$green100',
})
