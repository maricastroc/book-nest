import { styled } from '@/styles'

export const StyledLabel = styled('label', {
  display: 'block',
  color: '$gray300',
  fontSize: '0.875rem',
  transition: 'color 0.2s',
  fontWeight: 700,
  marginLeft: '0.3rem',

  variants: {
    focused: {
      true: {
        color: '$blue500',
      },
    },
  },
})
