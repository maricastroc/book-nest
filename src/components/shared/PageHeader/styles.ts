import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'none',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  alignSelf: 'start',
  gap: '0.8rem',
  textAlign: 'left',
  marginBottom: '1rem',
  width: '100%',

  '&.profile_styles': {
    display: 'none',
  },

  '@media (min-width: 1024px)': {
    display: 'flex',
    marginTop: '0.5rem',
  },
})

export const Header = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.8rem',

  h2: {
    fontSize: '1.5rem',
  },

  svg: {
    fontSize: '2rem',
    color: '$green100',
  },
})
