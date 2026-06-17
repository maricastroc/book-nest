import { styled } from '@/styles'

export const RatingActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  paddingRight: '1rem',
  width: '100%',
  gap: '0.6rem',
  marginTop: '0.75rem',
  borderRadius: 8,
})

export const RatingButton = styled('button', {
  display: 'flex',
  backgroundColor: 'transparent',
  border: 'none',
  alignItems: 'center',
  gap: '0.3rem',
  color: '$gray100',

  svg: {
    cursor: 'pointer',
    fontSize: '1rem',
    color: '$gray400',

    '&:hover': {
      filter: 'brightness(1.8)',
      transition: '200ms ease-in-out',
    },
  },

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',

        svg: {
          cursor: 'not-allowed',

          '&:hover': {
            filter: 'none',
            transition: 'none',
          },
        },
      },
    },
  },

  p: {
    fontSize: '0.85rem',
  },
})
