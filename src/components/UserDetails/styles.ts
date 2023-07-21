import { styled } from '../../styles'

export const Container = styled('div', {
  display: 'flex',
  backgroundColor: 'gray800',
  padding: '1.5rem',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

export const UserInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',

  h2: {
    fontSize: '1.1rem',
    color: '$white',
  },

  p: {
    fontSize: '0.85rem',
    color: '$gray400',
  },
})

export const Separator = styled('span', {
  width: 4,
  background: '$gradient-vertical',
  borderRadius: 8,
  height: 2,
  margin: '3rem 0',
})

export const UserInfoContainer = styled('div', {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
})

export const UserInfoItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',

  svg: {
    fontSize: '1.5rem',
    color: '$green100',
  },

  '@media (min-width: 580px)': {
    svg: {
      fontSize: '1.7rem',
    },
  },
})

export const ItemText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  alignItems: 'flex-start',

  p: {
    fontSize: '$sm',
    color: '$gray300',
  },

  h2: {
    fontSize: '0.95rem',
    color: '$white',
  },

  '@media (min-width: 580px)': {
    h2: {
      fontSize: '1rem',
    },
  },
})

export const AvatarContainer = styled('a', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 42,
  height: 42,
  borderRadius: '50%',
  background: '$gradient-vertical',
  marginBottom: '1.5rem',
})

export const AvatarDefault = styled('img', {
  overflow: 'hidden',
  objectFit: 'cover',
  borderRadius: '50%',
  width: 40,
  aspectRatio: 'auto 40 / 40',
  height: 40,
})
