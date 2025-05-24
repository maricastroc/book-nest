import { styled } from '@/styles'

export const StyledActionButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px $blue600',
  backgroundColor: 'transparent',
  borderRadius: 8,
  padding: '0.3rem',

  svg: {
    fontSize: '1.2rem',
    transition: '200ms all',

    '&.edit_icon': {
      color: '$green100',

      '&:hover': {
        filter: 'brightness(1.3)',
      },
    },

    '&.delete_icon': {
      color: '$red300',

      '&:hover': {
        filter: 'brightness(1.3)',
      },
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
