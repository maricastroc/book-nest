import { styled } from '@/styles'

export const DropdownButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.6rem',
  width: '2rem',
  height: '2rem',
  backgroundColor: 'rgba(131, 129, 217, 0.3)',
  borderRadius: '100%',
  borderColor: 'transparent',
  transition: 'all 200ms',
  cursor: 'pointer',

  '&:focus, &:focus-visible': {
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
  },

  svg: {
    fontSize: '1rem',
    color: '$gray100',
  },

  '&:hover': {
    filter: 'brightness(1.3)',
  },
})

export const Dropdown = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  position: 'absolute',
  width: '8.6rem',
  backgroundColor: '$gray600',
  borderRadius: 8,
  padding: '0.9rem 0',
  gap: '0.6rem',
  right: '4%',
  top: '92%',
  zIndex: 9997,
})

export const DropdownItem = styled('button', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '$gray200',
  marginLeft: '0.6rem',
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  cursor: 'pointer',
  transition: 'all 200ms',

  p: {
    color: '$gray200',
  },

  svg: {
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '$gray400',

    '&.edit_icon': {
      color: '$green100',
      filter: 'brightness(1.5)',
    },

    '&.delete_icon': {
      color: '$red300',
      filter: 'brightness(1.5)',
    },
  },

  '&:hover': {
    p: {
      '&.edit_icon': {
        filter: 'brightness(1.8)',
      },

      '&.delete_icon': {
        filter: 'brightness(1.8)',
      },
    },
  },
})
