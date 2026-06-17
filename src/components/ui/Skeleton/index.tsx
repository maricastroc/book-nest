import { styled, keyframes } from '@/styles'

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.4 },
})

export const SkeletonBox = styled('div', {
  backgroundColor: 'rgba(79, 97, 158, 0.3)',
  animation: `${pulse} 1.5s ease-in-out infinite`,
  variants: {
    variant: {
      rounded: { borderRadius: '4px' },
      circular: { borderRadius: '50%' },
    },
  },
  defaultVariants: {
    variant: 'rounded',
  },
})
