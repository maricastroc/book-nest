import { styled } from '@/styles'

export const Container = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'wrap',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '100%',
  gap: '0.5rem',

  '@media (min-width: 980px)': {
    alignItems: 'flex-start',
  },
})
