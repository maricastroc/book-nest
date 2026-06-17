import { styled } from '@/styles'

import {
  Root as RadixRoot,
  Indicator as RadixIndicator,
} from '@radix-ui/react-checkbox'

export const StyledCheckbox = styled(RadixRoot, {
  all: 'unset',
  backgroundColor: 'transparent',
  width: 18,
  height: 18,
  borderRadius: 4,
  border: 'solid 1px rgba(131, 129, 217, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, border-color 0.2s ease',

  '&[data-state="checked"]': {
    backgroundColor: 'transparent',
    border: 'solid 1px rgba(131, 129, 217, 0.5)',
  },

  '&:focus': {
    outline: 'none',
  },
})

export const StyledIndicator = styled(RadixIndicator, {
  color: 'white',
})

export const ChangePasswordInputContainer = styled('div', {
  display: 'flex',
  gap: '0.6rem',
  width: '100%',
  alignItems: 'center',
  fontSize: '0.9375rem',
})
