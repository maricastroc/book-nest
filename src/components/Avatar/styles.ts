import { styled } from '@/styles'

export const AvatarContainer = styled('a', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 42,
  height: 42,
  borderRadius: '50%',

  '&.medium': {
    width: 36,
    height: 36,
  },

  '&.regular': {
    width: 39,
    height: 39,
  },

  '&.bigger': {
    width: 48,
    height: 48,
  },

  '&.large': {
    width: 70,
    height: 70,
    marginBottom: '1.5rem',
  },
})

export const AvatarDefault = styled('img', {
  overflow: 'hidden',
  objectFit: 'cover',
  borderRadius: '50%',
  width: 40,
  aspectRatio: 'auto 40 / 40',
  height: 40,

  '&.medium': {
    width: 34,
    aspectRatio: 'auto 34 / 34',
    height: 34,
  },

  '&.regular': {
    width: 37,
    aspectRatio: 'auto 37 / 37',
    height: 37,
  },

  '&.bigger': {
    width: 46,
    aspectRatio: 'auto 46 / 46',
    height: 46,
  },

  '&.large': {
    width: 66,
    aspectRatio: 'auto 68 / 68',
    height: 66,
  },

  outline: '1.5px solid $green100',
  outlineOffset: 2,
})
