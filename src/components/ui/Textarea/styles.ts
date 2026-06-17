import { styled } from '@/styles'

export const StyledLabel = styled('label', {
  display: 'block',
  color: '$gray300',
  fontSize: '0.875rem',
  transition: 'color 0.2s',
  fontWeight: 700,
  marginBottom: '0.1rem',
  marginLeft: '0.3rem',

  variants: {
    focused: {
      true: {
        color: '$blue500',
      },
    },
  },
})

export const TextareaContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  width: '100%',
})

export const StyledTextarea = styled('textarea', {
  backgroundColor: 'transparent',
  border: 'solid 1px $blue600',
  color: '$gray300',
  padding: '0.75rem 0.6rem',
  fontSize: '0.85rem',
  borderRadius: 8,
  width: '100%',
  minHeight: '6rem',
  resize: 'vertical',
  fontFamily: 'inherit',
  lineHeight: '1.7',

  '&::placeholder': {
    color: '#8D95AF',
  },

  '&:focus': {
    backgroundColor: 'transparent',
    outline: 'none',
    boxShadow: 'none',
    borderBottom: 'solid 1px $blue500',
  },

  variants: {
    hasLabel: {
      true: {
        paddingTop: '0.4rem',
        paddingBottom: '0.6rem',
      },
    },
  },
})
