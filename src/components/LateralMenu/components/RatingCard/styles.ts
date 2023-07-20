import { styled } from '../../../../styles'

export const RatingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  backgroundColor: '$gray700',
  padding: '1.5rem',
  borderRadius: 8,
  width: '100%',
})

export const Header = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  gap: '1rem',
})

export const UserData = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
})

export const NameAndDate = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '0.1rem',

  time: {
    color: '$gray400',
    fontSize: '0.85rem',
  },

  p: {
    fontSize: '0.9rem',
  },
})

export const AvatarContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 39,
  height: 39,
  borderRadius: '50%',
  background: '$gradient-vertical',
})

export const AvatarDefault = styled('img', {
  overflow: 'hidden',
  objectFit: 'cover',
  borderRadius: '50%',
  width: 37,
  aspectRatio: 'auto 37 / 37',
  height: 37,
})

export const BookDescription = styled('div', {
  maxHeight: '10rem',
  marginTop: '1.5rem',
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
