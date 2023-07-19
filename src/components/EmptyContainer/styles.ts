import { styled } from '../../styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '12rem',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$gray600',
  borderRadius: 8,
  width: '100%',

  p: {
    fontSize: '1.3rem',
    marginBottom: '0.2rem',
  },

  svg: {
    fontSize: '3rem',
    marginBottom: '0.8rem',
  },
})
