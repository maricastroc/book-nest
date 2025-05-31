import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  fontWeight: 600,

  '&.smaller': {
    svg: {
      fontSize: '0.92rem',
    },
  },

  variants: {
    type: {
      relative: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '0.7rem',
        borderRadius: 15,
        color: '$gray300',
      },
      absolute: {
        position: 'absolute',
        top: 0,
        right: '0.3rem',
        padding: '0.1rem 0.5rem',
        fontSize: '1.25rem',
        fontWeight: 700,
        borderRadius: '0 8px 0 8px',
        color: '$green100',
      },

      svg: {
        fontSize: '1.05rem',
      },
    },
    status: {
      reading: {
        svg: {
          color: '#ca4036',
        },
      },
      read: {
        svg: {
          color: '$green100',
        },
      },
      wantToRead: {
        svg: {
          color: '#c64a96',
        },
      },
      didNotFinish: {
        svg: {
          color: '#cc803d',
        },
      },
    },
  },

  defaultVariants: {
    type: 'absolute',
  },
})
