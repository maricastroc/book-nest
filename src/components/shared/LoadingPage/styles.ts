import { styled } from '@/styles'

export const LoadingPageWrapper = styled('div', {
  width: '100%',
  height: '100vh',
  backgroundColor: '$gray800',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const LoadingContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  h2: {
    fontSize: '1.5rem',
    color: '$gray200',
  },
})
