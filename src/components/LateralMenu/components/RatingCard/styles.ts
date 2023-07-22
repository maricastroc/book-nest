import { styled } from '../../../../styles'

export const RatingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
})

export const RatingContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  backgroundColor: '$gray700',
  padding: '1.5rem',
  borderRadius: 8,
  width: '100%',

  '&.from_user': {
    backgroundColor: '$gray600',
  },
})

export const Header = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  gap: '1rem',

  '@media (min-width: 580px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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

export const DeleteAndEdit = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: '1rem',
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

export const ReviewFormContainer = styled('form', {
  position: 'relative',
  width: '100%',
})

export const ReviewForm = styled('textarea', {
  width: '100%',
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
  top: '66%',
  right: '3vw',

  '@media (min-width: 580px)': {
    right: '2vw',
  },

  '@media (min-width: 1024px)': {
    right: '2%',
  },
})

export const ButtonsContainer = styled('div', {
  display: 'flex',
  marginTop: '0.7rem',
  gap: '0.8rem',
  alignItems: 'center',
  justifyContent: 'flex-start',
})

export const ActionButton = styled('button', {
  cursor: 'pointer',
  backgroundColor: '$gray500',
  color: '$white',
  padding: '0.7rem',
  borderRadius: 8,
  border: 'none',
  width: '5rem',

  '&.edit_btn': {
    backgroundColor: '$gray500',
  },

  '&.cancel_btn': {
    backgroundColor: '#AD4552',
  },

  '&:hover': {
    filter: 'brightness(1.5)',
    transition: '200ms ease-in-out',
  },

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
      },
    },
  },
})

export const FormErrors = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.4rem',

  span: {
    color: '#F75A68',
    fontSize: '0.8rem',
  },
})
