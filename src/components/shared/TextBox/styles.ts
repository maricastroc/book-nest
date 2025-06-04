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
  color: '$green100',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.92rem',
  fontWeight: 700,

  '&.secondary': {
    color: '$purple100',
  },

  '&:focus': {
    outline: 'hidden',
    border: 'transparent',
  },
})

export const EmptyRating = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '100%',
  color: '$gray400',
  border: '1px dashed $gray400',
  borderRadius: 8,
  padding: '0.9rem',
})
