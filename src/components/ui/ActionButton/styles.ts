import { styled } from '@/styles'

export const StyledActionButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  backgroundColor: 'transparent',
  padding: '0.3rem',
  borderRadius: 8,

  svg: {
    fontSize: '1.35rem',
    transition: '200ms all',
  },

  '&.edit_icon': {
    backgroundColor: '$purple200',
    color: '$gray100',

    '&:hover': {
      filter: 'brightness(1.3)',
    },
  },

  '&.delete_icon': {
    backgroundColor: '$red300',
    color: '$gray100',

    '&:hover': {
      filter: 'brightness(1.3)',
    },
  },

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
      },
    },
  },
})
