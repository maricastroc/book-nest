import { styled } from '@/styles'

export const UserRatingBoxWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  minWidth: '100%',
})

export const UserRatingBoxContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  backgroundColor: '$gray700',
  padding: '1.5rem',
  borderRadius: 8,
  width: '100%',
})

export const UserRatingBoxHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  marginBottom: '1rem',

  '@media (min-width: 380px)': {
    marginBottom: 0,
    gap: '1rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export const UserDetailsWrapper = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
})

export const UserNameDateWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  marginBottom: '1.5rem',
  gap: '0.1rem',

  time: {
    color: '$gray400',
    fontSize: '0.85rem',
  },

  p: {
    fontSize: '0.9rem',
    position: 'relative',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  },
})
