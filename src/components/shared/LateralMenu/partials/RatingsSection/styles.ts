import { styled } from '@/styles'

export const RatingsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '0.5rem',
  marginTop: '3rem',
  paddingBottom: '2.5rem',
})

export const RatingsList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minWidth: '100%',
  gap: '1.5rem',

  '&.reverse': {
    flexDirection: 'column',
  },
})

export const RatingsListHeader = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'space-between',
  justifyContent: 'space-between',
  width: '100%',

  p: {
    fontSize: '$sm',
    color: '$gray200',
  },

  span: {
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '$purple100',
    fontWeight: 'bold',

    '&:hover': {
      filter: 'brightness(1.3)',
      transition: '200ms all ease-in-out',
    },
  },
})
