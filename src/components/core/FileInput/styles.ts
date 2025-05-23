import { styled } from '@/styles'

export const InputContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  borderBottom: 'solid 1px $blue600',
  paddingBottom: '0.5rem',
  width: 'auto',
})

export const HiddenFileInput = styled('input', {
  display: 'none',
  width: 'auto',
})

export const CustomFileButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  color: '$gray100',
  backgroundColor: '$purple200',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  padding: '0.5rem 0.75rem',
  fontSize: '0.8rem',
  fontWeight: 500,
  transition: 'background-color 0.2s',
  marginRight: '1rem',

  '&:not(:disabled):hover': {
    color: '$gray800',
    backgroundColor: '$gray100',

    svg: {
      color: '$gray800',
    },
  },

  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },
})

export const FileNameDisplay = styled('span', {
  color: '$gray300',
  fontSize: '0.875rem',
  fontStyle: 'italic',
  flex: 1,
  width: 'auto',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const StyledLabel = styled('label', {
  display: 'block',
  color: '$gray300',
  fontSize: '0.875rem',
  fontWeight: 700,
  marginLeft: '0.5rem',
  marginBottom: '0.5rem',
})
