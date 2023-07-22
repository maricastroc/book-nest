import { styled } from '../../styles'

export const Container = styled('div', {
  marginTop: '3rem',
  display: 'flex',
  backgroundColor: 'gray800',
  padding: '1.5rem',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 1200px)': {
    marginTop: '1.5rem',
  },
})

export const UserInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  h2: {
    fontSize: '1.25rem',
    color: '$white',
  },

  time: {
    fontSize: '0.85rem',
    color: '$gray400',
  },
})

export const Separator = styled('span', {
  width: 30,
  background: '$gradient-horizontal',
  borderRadius: 8,
  height: 4,
  margin: '2.8rem 0',
})

export const UserInfoContainer = styled('div', {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '2.5rem',
})

export const UserInfoItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',

  svg: {
    fontSize: '2rem',
    color: '$green100',
  },

  '@media (min-width: 580px)': {
    svg: {
      fontSize: '2.1rem',
    },
  },
})

export const ItemText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.1rem',

  p: {
    fontSize: '0.875rem',
    color: '$gray300',
  },

  h2: {
    fontSize: '1rem',
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
  width: 70,
  height: 70,
  borderRadius: '50%',
  background: '$gradient-vertical',
  marginBottom: '1.5rem',
})

export const AvatarDefault = styled('img', {
  overflow: 'hidden',
  objectFit: 'cover',
  borderRadius: '50%',
  width: 66,
  aspectRatio: 'auto 68 / 68',
  height: 66,
})
