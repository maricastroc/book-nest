import { styled } from '@/styles'

export const ScrollContainer = styled('div', {
  position: 'relative',
  width: '100%',
})

export const CaretRightIcon = styled('div', {
  position: 'absolute',
  cursor: 'pointer',
  right: '0.5rem',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 997,
  color: '$gray100',
  backgroundColor: '$blue600',
  borderRadius: '50%',
  width: '2rem',
  height: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.9,
  transition: 'all 0.2s',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',

  '&:hover': {
    opacity: 1,
    backgroundColor: '$gray500',
    transform: 'translateY(-50%) scale(1.1)',
  },
})

export const CaretLeftIcon = styled('div', {
  position: 'absolute',
  cursor: 'pointer',
  left: '0.5rem',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 997,
  color: '$gray100',
  backgroundColor: '$blue600',
  borderRadius: '50%',
  width: '2rem',
  height: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.7,
  transition: 'all 0.2s',
  boxShadow: '0 2px 4px rgba(73, 73, 73, 0.1)',

  '&:hover': {
    opacity: 1,
    backgroundColor: '$gray500',
    transform: 'translateY(-50%) scale(1.1)',
  },
})
