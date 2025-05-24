import { styled } from '@/styles'

export const ReadNotice = styled('div', {
  display: 'flex',
  position: 'absolute',
  top: 0,
  right: '0.3rem',
  padding: '0.1rem 0.5rem',
  fontSize: '1.25rem',
  fontWeight: 700,
  borderRadius: '0 8px 0 8px',
  color: '$green100',

  '&.reading': {
    svg: {
      color: '#ca4036',
    },
  },

  '&.read': {
    svg: {
      color: '$green100',
    },
  },

  '&.want_to_read': {
    svg: {
      color: '#c64a96',
    },
  },

  '&.did_not_finish': {
    svg: {
      color: '#cc803d',
    },
  },
})

export const ReadingStatusButton = styled('button', {
  backgroundColor: '$gray800',
  width: '1.5rem',
  height: '1.5rem',
  color: '$gray800',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.7rem',
  borderRadius: '50%',
  border: '2px solid $green100',

  svg: {
    color: '$green100',
    width: '0.7rem',
    height: '0.7rem',
  },
})

export const DividerLine = styled('span', {
  width: 30,
  background: '$gradient-horizontal',
  borderRadius: 8,
  height: 4,
  margin: '2.4rem 0',
})

export const PageBtn = styled('button', {
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  backgroundColor: 'transparent',
  color: '$gray400',
  border: 'none',

  p: {
    fontSize: '1rem',
  },

  svg: {
    fontSize: '1.5rem',
    color: '$gray400',
  },

  '&.active': {
    p: {
      color: '$green100',
      fontWeight: 'bold',
    },

    svg: {
      color: '$green100',
    },
  },

  '&:hover': {
    p: {
      color: '$gray100',
    },

    svg: {
      color: '$gray100',
    },
  },

  variants: {
    active: {
      true: {
        p: {
          color: '$gray100',
          fontWeight: 'bold',
        },

        svg: {
          color: '$gray100',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '4px',
          background: '$gradient-vertical',
          borderRadius: 8,
        },
      },
    },
  },
})

export const SignOutContainer = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.7rem',

  svg: {
    color: '#F75A68',
    fontSize: '1.5rem',
  },

  p: {
    fontSize: '0.95rem',
    color: '$gray100',
  },
})

export const SignInContainer = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  justifySelf: 'flex-end',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',
})

export const SignInButton = styled('button', {
  display: 'flex',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$white',
  gap: '0.8rem',

  svg: {
    color: '$green100',
    fontSize: '1.5rem',
  },

  p: {
    fontSize: '1rem',
    color: '$gray300',
  },
})

export const SidebarProfileContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',
})

export const PageBtnWrapper = styled('div', {
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  backgroundColor: 'transparent',
  border: 'none',

  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },
})

export const SearchBar = styled('div', {
  display: 'flex',
  backgroundColor: '$gray800',
  border: 'solid 1px $green200',
  borderRadius: 8,
  padding: '0.7rem 1.25rem',
  marginTop: '0.5rem',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',

  input: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '$white',
    width: '100%',
    fontSize: '0.9rem',

    '&:has(input:focus)': {
      borderColor: '$green200',
    },

    '&:focus': {
      boxShadow: 'none',
      outline: 'none',
      padding: 'none',
      border: 'none',
    },

    '&::placeholder': {
      color: '$gray400',
    },
  },

  svg: {
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '$green200',
  },

  '&:has(input:focus)': {
    borderColor: '$green100',
    svg: {
      color: '$green100',
    },
  },

  '@media (min-width: 480px)': {
    padding: '0.875rem 1.25rem',
    marginTop: 0,
  },

  '@media (min-width: 1024px)': {
    width: '60%',
    maxWidth: '25rem',
  },
})
