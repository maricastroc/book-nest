import { styled } from '../../../../styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  backgroundColor: '$gray700',
  margin: '0.5rem auto 1rem',
  padding: '1.5rem',
  borderRadius: 8,
  width: '100%',
})

export const ReviewFormHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '1rem',
})

export const UserData = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',

  p: {
    fontSize: '0.95rem',
    fontWeight: 'bold',
  },
})

export const AvatarContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: '$gradient-vertical',
})

export const AvatarDefault = styled('img', {
  overflow: 'hidden',
  objectFit: 'cover',
  borderRadius: '50%',
  width: 34,
  aspectRatio: 'auto 34 / 34',
  height: 34,
})

export const ReviewFormContainer = styled('div', {
  position: 'relative',
})

export const ReviewForm = styled('textarea', {
  marginTop: '1rem',
  backgroundColor: '$gray800',
  padding: '0.875rem 0.875rem 1.25rem',
  border: 'solid 1px $gray500',
  borderRadius: 8,
  height: 164,
  minHeight: 80,
  resize: 'none',
  color: '$white',
})

export const CharacterCounter = styled('span', {
  position: 'absolute',
  fontSize: '0.75rem',
  color: '$gray400',
  top: '85%',
  right: '6%',
})

export const ButtonsContainer = styled('div', {
  marginTop: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  justifyContent: 'flex-end',
  width: '100%',
})

export const ActionButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: 8,
  backgroundColor: '$gray600',
  padding: '0.5rem',

  svg: {
    fontSize: '1.5rem',
  },

  '&:hover': {
    backgroundColor: '$gray500',
    transition: 'all 0.5s ease-in-out',
  },
})
