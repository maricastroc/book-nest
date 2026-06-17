import { styled } from '@/styles'

export const StyledArchivedWarning = styled('div', {
  display: 'flex',
  alignItems: 'center',
  margin: '1rem 0 0',
  justifyContent: 'center',
  padding: '0.8rem',
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  width: '100%',
  fontSize: '0.85rem',
  color: '$gray100',
  backgroundColor: '$gray600',
  borderLeft: '4px solid $green100',
  gap: '0.5rem',

  p: {
    fontSize: '0.85rem',
    lineHeight: 1.6,
    textAlign: 'left',
  },

  '& strong': {
    color: '$green100',
    fontWeight: 700,
  },
})
