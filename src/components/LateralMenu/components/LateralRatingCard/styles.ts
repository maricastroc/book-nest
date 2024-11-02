import { styled } from '../../../../styles'

export const RatingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  minWidth: '100%',
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
