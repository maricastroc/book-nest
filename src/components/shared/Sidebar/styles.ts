import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  left: '1.5rem',
  zIndex: 1,
})

export const BackgroundContainer = styled('div', {
  paddingTop: '1rem',
  position: 'relative',

  img: {
    objectFit: 'cover',
    overflow: 'hidden',
    borderRadius: 12,
    width: '12rem',
    height: '95vh',
  },

  '@media(min-width: 980px)': {
    img: {
      width: '14.5rem',
    },
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
    width: '8.5rem',
    height: 'auto',
  },

  '@media(min-width: 1200px)': {
    img: {
      width: '9.3rem',
      height: 'auto',
    },
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
