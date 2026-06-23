import { styled } from '@/styles'

export const CategoriesWrapper = styled('div', {
  marginTop: '2rem',
  width: '100%',
  paddingBottom: '0.8rem',

  '@media (min-width: 1024px)': {
    paddingBottom: '1.2rem',
  },
})

export const SelectCategoryButton = styled('button', {
  cursor: 'pointer',
  backgroundColor: 'transparent',
  borderRadius: 16,
  border: 'solid 1px $purple100',
  color: '$purple100',
  padding: '0.4rem 1rem',
  fontSize: '0.95rem',
  whiteSpace: 'nowrap',

  '&:hover': {
    transition: '200ms',
    border: 'solid 1px $purple300',
    backgroundColor: '$purple300',
    color: '$white',
  },

  '&:disabled': {
    backgroundColor: '$blue600',
    border: 'solid 1px $blue600',
    color: '$gray100',
    cursor: 'not-allowed !important',
  },

  variants: {
    selected: {
      true: {
        border: 'solid 1px $purple300',
        backgroundColor: '$purple300',
        color: '$white',
      },
    },
  },
})
