import { styled } from '@/styles'

import {
  Content as RadixContent,
  Title as RadixTitle,
  Close as RadixClose,
} from '@radix-ui/react-dialog'

export const Content = styled(RadixContent, {
  padding: '1.5rem',
  backgroundColor: '$gray700',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(320px, 90vw, 480px)',
  borderRadius: 8,
  zIndex: 9998,
  overflow: 'scroll',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',
  height: 'clamp(320px, 90vh, 40rem)',

  '@media (min-width: 480px)': {
    width: 'clamp(320px, 85vw, 700px)',
  },

  '@media (min-width: 768px)': {
    padding: '2rem',
    width: 'clamp(20rem, 80vw, 40rem)',
  },

  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
    border: 'none',
  },
})

export const Header = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '2rem',
})

export const Title = styled(RadixTitle, {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  textAlign: 'left',
  marginTop: '0.5rem',

  h2: {
    fontSize: '1.1rem',
  },

  p: {
    fontWeight: 400,
    color: '$gray200',
    fontSize: '0.9rem',
    lineHeight: '1.5rem',
  },

  '@media (min-width: 768px)': {
    gap: '0.3rem',

    h2: {
      fontSize: '1.2rem',
    },

    p: {
      fontSize: '0.95rem',
    },
  },
})

export const CloseButton = styled(RadixClose, {
  color: '$gray300',
  display: 'flex',
  width: '1.5rem',
  justifyContent: 'flex-end',
  cursor: 'pointer',
  backgroundColor: '$gray700',
  border: '0',
  marginTop: '0.5rem',

  svg: {
    color: '$gray300',
    fontSize: '1.3rem',
    marginRight: '-0.6rem',
  },

  '&:hover': {
    transition: '200ms',

    svg: {
      color: '$purple100',
    },
  },

  '&:focus': {
    boxShadow: 'none',
    outline: 'none',
    border: 'none',
  },

  '@media (min-width: 480px)': {
    marginTop: 0,
  },
})

export const FormContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
  alignItems: 'center',
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
  flexDirection: 'column',
  justifyContent: 'center',
  marginBottom: 0,
  gap: '2rem',

  '@media (min-width: 480px)': {
    marginBottom: '1.5rem',
    flexDirection: 'row',
    gap: 0,
    justifyContent: 'space-between',
  },
})

export const PreviewContainer = styled('div', {
  position: 'relative',
  backgroundColor: 'transparent',
  width: '6rem',
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 480px)': {
    width: '10rem',
  },
})

export const ImagePreview = styled('div', {
  position: 'relative',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px rgba(131, 129, 217, 0.5)',
  color: '$gray100',
  padding: '0.4rem 0.6rem',
  borderRadius: 8,
  width: '6.2rem',
  height: '8.5rem',

  svg: {
    width: '3rem',
    height: '3rem',
    color: '$purple100',
  },

  img: {
    borderRadius: 8,
    width: '6.2rem',
    height: '8.5rem',
  },
})

export const EditBtn = styled('button', {
  position: 'absolute',
  cursor: 'pointer',
  top: '82%',
  left: '72%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$gray100',
  border: 'solid 1px $gray500',
  borderRadius: '50%',
  color: '$gray100',
  width: '1.7rem',
  height: '1.7rem',

  svg: {
    borderRadius: '50%',
    color: '$gray600',
    width: '1.2rem',
    height: '1.2rem',
  },

  '@media (min-width: 480px)': {
    top: '85%',
    left: '67%',
  },
})

export const ImageInput = styled('div', {
  backgroundColor: 'transparent',
  border: 'solid 1px rgba(131, 129, 217, 0.5)',
  color: '$gray100',
  padding: '0.4rem 0.6rem',
  fontSize: '0.95rem',
  borderRadius: 10,

  input: {
    display: 'none',
  },

  button: {
    backgroundColor: '$gray600',
    color: '$gray100',
    padding: '0.2rem 0.7rem',
    cursor: 'pointer',
    borderRadius: 8,
    fontSize: '0.8rem',
    border: 'none',

    '&:hover': {
      transition: '200ms',
      backgroundColor: '$gray500',

      svg: {
        backgroundColor: '$gray500',
      },
    },
  },

  span: {
    marginLeft: '0.7rem',
  },
})

export const Input = styled('input', {
  backgroundColor: 'transparent',
  border: 'solid 1px rgba(131, 129, 217, 0.5)',
  color: '$gray100',
  padding: '0.6rem',
  fontSize: '0.95rem',
  borderRadius: 10,
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
