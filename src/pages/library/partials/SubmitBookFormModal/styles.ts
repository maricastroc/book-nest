import { styled } from '@/styles'

export const FormContainer = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  width: '100%',
  alignItems: 'center',
  paddingRight: '0.65rem',
  overflowX: 'hidden',
})

export const FormContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
  height: '100%',

  '@media (min-width: 980px)': {
    paddingRight: '1rem',
  },
})

export const CoverSectionContainer = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'nowrap',
  overflow: 'visible',
})

export const PreviewContainer = styled('div', {
  position: 'relative',
  backgroundColor: 'transparent',
  width: '4.5rem',
  minWidth: '4.5rem',
  height: '6.5rem',
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const ImagePreview = styled('button', {
  position: 'relative',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px $blue600',
  cursor: 'pointer',
  color: '$gray100',
  borderRadius: 8,
  width: '100%',
  height: '100%',
  overflow: 'hidden',

  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  svg: {
    borderRadius: '50%',
    color: '$blue600',
    width: '2rem',
    height: '2rem',
  },
})

export const Input = styled('input', {
  backgroundColor: 'transparent',
  border: 'solid 1px rgba(131, 129, 217, 0.5)',
  color: '$gray100',
  padding: '0.6rem',
  fontSize: '0.95rem',
  borderRadius: 10,

  '&:disabled': {
    backgroundColor: '$gray400',
    border: 'solid 1px $gray400',
    color: '$gray100',
    cursor: 'not-allowed !important',
    pointerEvents: 'none',

    '&::placeholder': {
      color: '$gray100',
    },
  },
})

export const Textarea = styled('textarea', {
  width: '100%',
  backgroundColor: '$gray700',
  padding: '0.875rem 0.875rem 1.25rem',
  border: 'solid 1px rgba(131, 129, 217, 0.5)',
  borderRadius: 8,
  height: 188,
  minHeight: 80,
  color: '$gray300',
  lineHeight: '1.45rem',
  fontSize: '0.9rem',
  resize: 'vertical',

  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },

  '&:disabled': {
    backgroundColor: '$gray400',
    border: 'solid 1px $gray400',
    color: '$gray100',
    cursor: 'not-allowed !important',
    pointerEvents: 'none',

    '&::placeholder': {
      color: '$gray100',
    },
  },
})

export const CustomSelect = styled('select', {
  width: '100%',
  backgroundColor: '$gray800',
  border: 'solid 1px $gray500',
  borderRadius: 8,
  color: '$gray300',

  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },
})

export const ImageInputContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
  width: '100%',
})

export const ChangePasswordInputContainer = styled('div', {
  display: 'flex',
  gap: '0.6rem',
  width: '100%',
  alignItems: 'center',
})
