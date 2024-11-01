import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 1.5rem 3rem',
  maxWidth: 'clamp(80rem, 85%, 40rem)',
  zIndex: '0',

  '@media (min-width: 980px)': {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    alignItems: 'center',
    padding: '0 1.5rem',
    margin: '0 auto',
    maxWidth: '100%',
  },

  '@media (min-width: 1200px)': {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    maxWidth: '90rem',
    margin: '0 auto',
  },
})

export const CoverContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.7rem 1.25rem',
  position: 'relative',
  width: '100%',

  '.cover_image': {
    display: 'none',
  },

  '.logo_image': {
    alignSelf: 'flex-start',
    position: 'relative',
    width: '210px',
    height: 'auto',
  },

  '@media (min-width: 980px)': {
    '.cover_image': {
      display: 'flex',
      borderRadius: '12px',
      width: '100%',
    },

    '.logo_image': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '210px',
      height: 'auto',
    },
  },
})

export const Separator = styled('span', {
  width: '100%',
  height: 0.7,
  backgroundColor: '$gray700',
  margin: '0.5rem 0 2.5rem',

  '@media (min-width: 980px)': {
    display: 'none',
  },
})

export const WelcomeContent = styled('div', {
  display: 'flex',
  padding: '0 1.25rem',
  gap: '3.8rem',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '30rem',

  '@media (min-width: 980px)': {
    padding: '3.5rem 1.25rem',
    minWidth: '25rem',
    gap: '3rem',
  },

  '@media (min-width: 1200px)': {
    maxWidth: '30rem',
  },
})

export const WelcomeContainer = styled('div', {
  display: 'flex',
  width: '100%',
  gap: '3.8rem',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 480px)': {
    alignItems: 'center',
  },
})

export const Heading = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  textAlign: 'center',

  h2: {
    fontSize: '$2xl',
  },

  p: {
    color: '$gray200',
  },

  '@media (min-width: 980px)': {
    textAlign: 'left',
  },
})

export const FormContainer = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
})

export const SignUpBtn = styled('button', {
  backgroundColor: '$transparent',
  cursor: 'pointer',
  fontSize: '0.8rem',
  border: 'none',
  color: '$gray400',
  marginTop: '-1rem',

  '&:hover': {
    color: '$gray300',
    transition: '200ms',
  },

  '@media (min-width: 480px)': {
    fontSize: '0.9rem',
  },
})

export const Divider = styled('span', {
  backgroundColor: '$gray600',
  height: 0.5,
  color: '$gray300',
  width: '100%',
  marginTop: 1,
})

export const Input = styled('input', {
  backgroundColor: 'transparent',
  border: 'solid 1px $gray500',
  color: '$gray100',
  padding: '0.6rem',
  fontSize: '0.95rem',
  borderRadius: 10,
})

export const AuthContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  gap: '1.8rem',
  color: '$gray300',
  fontSize: '0.9rem',
})

export const AuthOptions = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',
  width: '100%',

  '@media (min-width: 480px)': {
    flexDirection: 'row',
    width: 'auto',
  },
})

export const AuthItem = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  color: '$gray300',
  fontSize: '0.9rem',
  border: '1px solid $gray500',
  borderRadius: 8,
  padding: '0.8rem 1rem',
  backgroundColor: 'transparent',
  width: '100%',
  cursor: 'pointer',

  p: {
    borderBottom: '1px solid transparent',
  },

  svg: {
    color: '$purple100',
  },

  '@media (min-width: 480px)': {
    border: 'none',
    width: 'auto',
    backgroundColor: 'transparent',
    padding: 0,

    '&:hover': {
      p: {
        borderBottom: '1px solid $gray300',
        transition: '200ms',
      },
    },
  },
})

export const HorizontalDivider = styled('span', {
  backgroundColor: '$gray600',
  height: '2rem',
  color: '$gray300',
  width: 1,
  marginTop: 1,
})
