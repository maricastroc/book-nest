import { styled } from '../../styles'

export const Container = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '2rem 0',

  img: {
    width: '8.5rem',
    height: 'auto',
  },

  svg: {
    color: '$white',
    fontSize: '1.8rem',
  },
})
