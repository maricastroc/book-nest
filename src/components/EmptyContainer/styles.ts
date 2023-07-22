import { styled } from '../../styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '12rem',
  padding: '2rem',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$gray600',
  borderRadius: 8,
  width: '100%',
  marginBottom: '1.5rem',

  p: {
    fontSize: '1.3rem',
    marginBottom: '0.4rem',
  },

  span: {
    lineHeight: '140%',
  },

  svg: {
    fontSize: '3rem',
    marginBottom: '0.8rem',
  },

  '@media (min-width: 480px)': {
    height: '13rem',
    marginBottom: '1.5rem',
  },
})
