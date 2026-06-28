import { styled } from '@/styles'

export const TextBoxWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
})

export const TextBoxContent = styled('div', {
  position: 'relative',
  overflowY: 'hidden',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  transition: 'max-height 0.3s ease',
  color: '$gray200',
  width: '100%',

  p: {
    textAlign: 'left',
    color: '$gray300',
    lineHeight: '1.4rem',
    fontSize: '0.9rem',
    wordBreak: 'break-word',
    paddingRight: '0.3rem',
  },
})

export const ViewMoreButton = styled('button', {
  display: 'inline',
  backgroundColor: 'transparent',
  color: '#e8b14c',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontSize: '0.82rem',
  fontWeight: 500,
  outline: 'none',

  '&:hover': {
    opacity: 0.75,
  },

  '&:focus, &:focus-visible': {
    outline: 'none !important',
    border: 'none !important',
    boxShadow: 'none !important',
  },
})

export const EmptyRating = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  color: '$gray400',
  border: '1px dashed $gray400',
  borderRadius: 8,
  padding: '0.9rem',
})
