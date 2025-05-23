import { styled } from '@/styles'

export const StyledInput = styled('input', {
  backgroundColor: 'transparent',
  border: 'solid 1px $blue600',
  color: '$gray200',
  padding: '0.65rem 0.6rem',
  fontSize: '0.9rem',
  borderRadius: 8,
  width: '100%',

  '&::placeholder': {
    color: '#8D95AF',
  },

  '&:focus': {
    backgroundColor: 'transparent',
    outline: 'none',
    boxShadow: 'none',
  },

  '&:disabled': {
    backgroundColor: '$blue600',
    borderColor: '$blue600',
    cursor: 'not-allowed',
  },
})

export const InputContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
})

export const ToggleButton = styled('button', {
  position: 'absolute',
  right: '0.5rem',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '$gray100',
  padding: '0.25rem',

  '&:focus': {
    outline: 'none',
  },
})

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
