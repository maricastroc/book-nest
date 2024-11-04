import { styled } from '../../styles'
import Link from 'next/link'

export const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  gap: '0.8rem',
})

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  backgroundColor: '$gray700',
  borderRadius: 8,
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
})

export const Heading = styled('div', {
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

export const BookContainer = styled('div', {
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

export const BookCover = styled('img', {
  width: '6.5rem',
  height: 'auto',
  borderRadius: 8,
  outline: '1.2px solid rgba(141, 149, 175, 0.7)',
  outlineOffset: 3,
})

export const BookDetails = styled('div', {
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

export const BookData = styled('div', {
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

export const BookInfo = styled('div', {
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

export const BookInfoText = styled('div', {
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

export const BookDescription = styled('div', {
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

export const Separator = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: 'rgba(131, 129, 217, 0.7)',
  opacity: 0.4,
})

export const ImageWrapper = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: 42,
  height: 42,

  borderRadius: '$full',
  background: '$gradient-vertical',
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

export const DeleteAndEdit = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
  gap: '0.4rem',
  marginTop: '0.5rem',
  borderRadius: 8,

  svg: {
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '$gray400',

    '&.edit_icon': {
      color: '$green100',
    },

    '&.delete_icon': {
      color: '#C6616D',
    },

    '&:hover': {
      filter: 'brightness(1.5)',
      transition: '200ms ease-in-out',
    },
  },
})
