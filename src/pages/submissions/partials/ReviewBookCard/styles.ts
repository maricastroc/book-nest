import { styled } from '@/styles'

export const BookCardWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '1.2rem',
  borderRadius: 8,
  position: 'relative',
  backgroundColor: '$gray700',
  width: '100%',
  gap: '0.7rem',
  minWidth: '17.3rem',
})

export const BookCardBox = styled('div', {
  display: 'flex',
  alignItems: 'stretch',
  gap: '0.7rem',
  width: '100%',
  position: 'relative',

  time: {
    fontSize: '0.8rem',
    color: '$gray400',
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
    fontSize: '0.9rem',
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
    fontSize: '0.9rem',
    color: '$gray400',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  },
})

export const BookCover = styled('img', {
  width: '5.2rem',
  height: '7.5rem',
  borderRadius: 8,
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',
})

export const UserInfoWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '0.7rem',
  width: '100%',
})

export const UserInfoText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  fontSize: '0.82rem',
  color: '$gray200',

  p: {
    fontSize: '0.82rem',
    color: '$gray200',
  },
})

export const RatingWrapper = styled('div', {
  marginTop: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.05rem',

  p: {
    color: '$gray400',
    fontSize: '0.8rem',
  },
})

export const EditButton = styled('button', {
  marginTop: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem',
  width: '100%',
  backgroundColor: '$purple200',
  color: '$gray100',
  transition: 'all 200ms',
  cursor: 'pointer',
  borderRadius: 12,
  borderColor: 'transparent',

  '&:focus, &:focus-visible': {
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
  },

  '&:hover': {
    transition: '200ms all',
    backgroundColor: '$gray100',
    color: '$gray800',
  },
})

export const DividerLine = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: '$gray500',
})
