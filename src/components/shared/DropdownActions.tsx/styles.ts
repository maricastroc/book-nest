import { styled } from '@/styles'

export const DropdownButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.6rem',
  width: '1.75rem',
  height: '1.75rem',
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
  backgroundColor: '$gray600',
  borderRadius: 8,
  padding: '1rem 1rem',
  gap: '0.6rem',
  right: '4%',
  width: 'auto',
  top: '92%',
  zIndex: 9997,

  '&.larger': {
    width: '9.6rem',
    padding: '0.7rem 0',
  },

  variants: {
    variant: {
      default: {
        right: '4%',
        top: '92%',
      },

      secondary: {
        right: '0%',
        top: '58%',
      },
    },
  },

  defaultVariants: {
    variant: 'default',
  },
})

export const DropdownItem = styled('button', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: '$gray200',
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  cursor: 'pointer',
  transition: 'all 200ms',

  svg: {
    fontSize: '1.1rem',
    transition: 'all 200ms',
  },

  p: {
    color: '$gray200',
    transition: 'all 200ms',
  },

  '&.edit_icon': {
    color: '$green100',
    filter: 'brightness(1.5)',
  },

  '&.delete_icon': {
    color: '$red300',
    filter: 'brightness(1.5)',
  },

  '&:hover': {
    '&.edit_icon': {
      p: {
        color: '$green100',
      },
    },

    '&.delete_icon': {
      p: {
        color: '$red300',
      },
    },
  },
})

export const DividerLine = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: '$gray400',
  opacity: 0.7,
})
