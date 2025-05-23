import { styled } from '@/styles'

export const StyledForm = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: 'auto',
  gap: '1.5rem',

  variants: {
    isLarger: {
      true: {
        maxWidth: '29rem',
      },
    },
    isProfileScreen: {
      true: {
        width: 'auto',
      },
    },
  },
})
