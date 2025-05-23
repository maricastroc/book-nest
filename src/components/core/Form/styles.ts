import { styled } from '@/styles'

export const StyledForm = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  width: '85vw',
  maxWidth: '27rem',
  height: 'auto',
  gap: '1rem',

  variants: {
    isLarger: {
      true: {
        maxWidth: '29rem',
      },
    },
    isProfileScreen: {
      true: {
        gap: '1rem',
        width: 'auto',
      },
    },
  },
})
