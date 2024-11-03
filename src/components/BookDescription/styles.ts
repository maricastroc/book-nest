import { styled } from '@/styles'

export const TruncatedText = styled('div', {
  maxHeight: '9rem',
  position: 'relative',
  overflow: 'hidden',

  '> div': {
    maxHeight: '9rem',
  },

  p: {
    color: '$gray300',
    lineHeight: '160%',
    fontSize: '$sm',
    maxHeight: '8.5rem',
    wordBreak: 'break-word',
  },

  '.ellipsis': {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: '$sm',
    width: '100%',
    backgroundColor: '$gray700',
    color: '$purple100',
    fontWeight: 'bold',
  },

  '.see-more': {
    cursor: 'pointer',
    marginLeft: '0.2rem',
    fontSize: '$sm',
  },
})
