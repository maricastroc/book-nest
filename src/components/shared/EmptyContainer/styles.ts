import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '12rem',
  padding: '2rem',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
  borderRadius: 8,
  width: '100%',
  border: 'dashed 1px $gray500',
  marginBottom: '1.5rem',

  p: {
    fontSize: '1rem',
    marginBottom: '0.4rem',
    fontWeight: 700,
    color: '$gray300',
  },

  span: {
    lineHeight: '140%',
    color: '$gray300',
  },

  svg: {
    fontSize: '2.5rem',
    marginBottom: '0.8rem',
  },

  '@media (min-width: 480px)': {
    height: '8rem',
    marginBottom: '1.5rem',
  },
})
