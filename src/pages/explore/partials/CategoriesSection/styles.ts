import { styled } from '@/styles'

export const ScrollContainer = styled('div', {
  position: 'relative',
  width: '100%',
})

export const Categories = styled('div', {
  marginTop: '2rem',
  display: 'flex',
  overflowX: 'scroll',
  gap: '0.7rem',
  alignItems: 'center',
  width: '100%',
  padding: '0 1.8rem 0.8rem',

  '&::-webkit-scrollbar': {
    display: 'none',
  },

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

  '&.loading': {
    cursor: 'not-allowed',
    opacity: 0.7,

    '&:hover': {
      backgroundColor: 'transparent',
      border: 'solid 1px $purple100',
      color: '$purple100',
      opacity: 0.7,
    },
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

export const CaretRightIcon = styled('div', {
  position: 'absolute',
  cursor: 'pointer',
  right: 0,
  top: '52%',
  transform: 'translateY(-50%)',
  zIndex: 997,
  color: '$gray100',
  width: '2rem',
  height: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.9,
  transition: 'all 0.2s',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',

  '&:hover': {
    opacity: 1,
    transform: 'translateY(-50%) scale(1.1)',
  },

  '@media (min-width: 1024px)': {
    right: 0,
    top: '48%',
  },
})

export const CaretLeftIcon = styled('div', {
  position: 'absolute',
  cursor: 'pointer',
  left: 0,
  top: '52%',
  transform: 'translateY(-50%)',
  zIndex: 997,
  color: '$gray100',
  width: '2rem',
  height: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.7,
  transition: 'all 0.2s',
  boxShadow: '0 2px 4px rgba(73, 73, 73, 0.1)',

  '&:hover': {
    opacity: 1,
    transform: 'translateY(-50%) scale(1.1)',
  },

  '@media (min-width: 1024px)': {
    right: 0,
    top: '48%',
  },
})
