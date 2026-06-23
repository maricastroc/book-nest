import { styled } from '@/styles'

export const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  width: '100%',
  maxWidth: '26rem',
  margin: '0 auto',
})

export const FormHeader = styled('div', {
  marginBottom: '0.75rem',

  h2: {
    color: '$gray200',
    fontSize: '1.375rem',
    fontWeight: 400,
    marginBottom: '0.25rem',
  },

  p: {
    color: '$blue600',
    fontSize: '0.8125rem',
  },
})

export const FieldGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const Divider = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  margin: '0.25rem 0',

  '&::before, &::after': {
    content: '',
    flex: 1,
    height: '1px',
    backgroundColor: '$gray500',
  },

  span: {
    color: '$blue600',
    fontSize: '0.6875rem',
    whiteSpace: 'nowrap',
  },
})

export const SignupLink = styled('p', {
  textAlign: 'center',
  fontSize: '0.75rem',
  color: '$blue600',

  a: {
    color: '$purple100',
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
})

export const SocialButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  height: 40,
  width: '100%',
  backgroundColor: 'transparent',
  border: '1px solid $gray500',
  borderRadius: 8,
  color: '$gray400',
  fontSize: '0.8125rem',
  cursor: 'pointer',
  transition: 'border-color 150ms, color 150ms',

  '&:hover': {
    borderColor: '$gray500',
    color: '$gray300',
  },
})

export const SocialButtons = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})
