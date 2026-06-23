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

export const AvatarSection = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '0.25rem',
})

export const AvatarLabel = styled('p', {
  color: '$gray400',
  fontSize: '0.8125rem',
})

export const AvatarActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

export const AvatarUploadWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

export const DeleteAvatarButton = styled('button', {
  backgroundColor: 'transparent',
  border: 'none',
  color: '$blue600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.25rem',
  borderRadius: '4px',
  transition: 'color 0.2s ease',

  '&:hover': {
    color: '$red300',
  },
})

export const LoginLink = styled('p', {
  textAlign: 'center',
  fontSize: '0.75rem',
  color: '$blue600',
  marginTop: '0.25rem',

  a: {
    color: '$purple100',
    textDecoration: 'none',
    cursor: 'pointer',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
})
