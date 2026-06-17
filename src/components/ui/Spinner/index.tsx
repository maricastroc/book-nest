import { styled, keyframes } from '@/styles'

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

export const Spinner = styled('div', {
  border: '3px solid rgba(131, 129, 217, 0.2)',
  borderTop: '3px solid #8381D9',
  borderRadius: '50%',
  animation: `${spin} 0.8s linear infinite`,
  variants: {
    size: {
      sm: { width: '1.5rem', height: '1.5rem' },
      md: { width: '3rem', height: '3rem' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
