import { styled } from '@/styles'

export const TextBoxWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
})

export const TextBoxContent = styled('div', {
  position: 'relative',
  overflowY: 'hidden',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  transition: 'max-height 0.3s ease',
  color: '$gray200',

  p: {
    color: '$gray300',
    lineHeight: '1.5rem',
    fontSize: '0.9rem',
    wordBreak: 'break-word',
    paddingRight: '0.3rem',
  },
})

export const ViewMoreButton = styled('button', {
  backgroundColor: 'transparent',
  color: '$green100',
  border: 'none',
  cursor: 'pointer',
  padding: '0.5rem 0',
  fontSize: '0.92rem',
  fontWeight: 700,

  '&.secondary': {
    color: '$purple100',
  },

  '&:focus': {
    outline: 'hidden',
    borderRadius: 8,
    border: 'transparent',
  },
})
