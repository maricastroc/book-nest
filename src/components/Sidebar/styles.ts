import { styled } from '../../styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

export const BackgroundContainer = styled('div', {
  paddingTop: '1rem',
  position: 'relative',

  img: {
    objectFit: 'cover',
    overflow: 'hidden',
    borderRadius: 12,
    width: '14.5rem',
    height: '95vh',
  },
})

export const SidebarContent = styled('div', {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '90%',
  paddingTop: '1.5rem',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  img: {
    width: '8rem',
    height: 'auto',
  },
})

export const SidebarMain = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

export const ItemsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '2rem',
  marginTop: '4rem',
})

export const Item = styled('button', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  paddingLeft: '1.5rem',
  backgroundColor: 'transparent',
  border: 'none',

  p: {
    color: '$gray400',
    fontSize: '1rem',
  },

  svg: {
    fontSize: '1.5rem',
    color: '$gray400',
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

export const ProfileContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',
})

export const SignOutContainer = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.7rem',

  svg: {
    color: '#F75A68',
    fontSize: '1.2rem',
  },

  p: {
    fontSize: '0.95rem',
    color: '$gray100',
  },
})

export const AvatarContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: '$gradient-vertical',
})

export const AvatarDefault = styled('img', {
  overflow: 'hidden',
  objectFit: 'cover',
  borderRadius: '50%',
  width: 34,
  aspectRatio: 'auto 34 / 34',
  height: 34,
})
