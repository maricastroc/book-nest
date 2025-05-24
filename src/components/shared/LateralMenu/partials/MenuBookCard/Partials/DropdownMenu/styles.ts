import { styled } from '@/styles'

export const AddToLibraryDropdown = styled('div', {
  position: 'absolute',
  top: '3.2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: '$gray700',
  border: '2px solid $gray700',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',
  width: '100%',
  zIndex: 999,
})

export const ReadingStatusItem = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.9rem',
  color: '$gray100',
  width: '100%',
  border: 'transparent',
  backgroundColor: 'transparent',
  height: '2.7rem',
  justifyContent: 'center',
  padding: '0 1.5rem',

  '&.selected': {
    color: '$green100',
  },

  '&:not(:disabled):hover': {
    color: '$green100',
    transition: 'all 200ms',
  },

  '&:disabled': {
    color: '$gray400',
    cursor: 'not-allowed !important',
    border: 'none',
  },
})

export const DividerDropdown = styled('span', {
  width: '100%',
  height: 0.2,

  margin: 0,
  padding: 0,
  opacity: 0.7,
})

export const WarningMessage = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.3rem',
  padding: '0.75rem 1rem',
  fontSize: '0.82rem',
  color: '$gray200',
  borderTop: '1px solid $gray600',
  marginTop: '0.5rem',

  svg: {
    color: '$green100',
    marginTop: '0.15rem',
  },

  strong: {
    fontWeight: 600,
  },
})
