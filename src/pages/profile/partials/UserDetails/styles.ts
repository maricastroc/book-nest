import { styled } from '@/styles'

export const UserProfileContainer = styled('div', {
  display: 'flex',
  backgroundColor: 'gray800',

  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '0.5rem',
})

export const UserProfileInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  textAlign: 'center',

  h2: {
    fontSize: '1.25rem',
    color: '$white',
  },

  time: {
    fontSize: '0.85rem',
    color: '$gray400',
  },
})

export const UserStatsWrapper = styled('div', {
  display: 'grid',
  width: '100%',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',

  '@media (min-width: 580px)': {
    gap: '1.5rem',
  },

  '@media (min-width: 1024px)': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  '@media (min-width: 1400px)': {
    padding: '0 2rem',
  },
})

export const UserStatItem = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  gap: '1rem',
  width: '100%',
  backgroundColor: '$gray700',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',
  padding: '0.8rem',
  height: '8rem',

  svg: {
    fontSize: '2.7rem',
    color: '$green100',
    flexShrink: 0,
  },

  '@media (min-width: 480px)': {
    height: 'auto',
    padding: '1rem',
  },

  '@media (min-width: 580px)': {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '1rem 1.5rem',
    height: '8rem',

    svg: {
      fontSize: '2.8rem',
    },
  },

  '@media (min-width: 980px)': {
    height: '8rem',
  },

  '@media (min-width: 1024px)': {
    justifyContent: 'center',

    svg: {
      fontSize: '2.5rem',
    },
  },

  '@media (min-width: 1200px)': {
    height: '7.5rem',
  },
})

export const UserStatText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '0.1rem',

  p: {
    fontSize: '0.8rem',
    color: '$gray300',
  },

  h2: {
    fontSize: '1rem',
    color: '$white',
  },

  '@media (min-width: 480px)': {
    p: {
      fontSize: '0.85rem',
    },

    h2: {
      fontSize: '1.1rem',
    },
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
    textAlign: 'left',
    width: '60%',

    h2: {
      fontSize: '1.3rem',
    },

    p: {
      fontSize: '0.95rem',
      color: '$gray300',
    },
  },

  '@media (min-width: 1024px)': {
    p: {
      fontSize: '0.9rem',
    },

    h2: {
      fontSize: '1.2rem',
    },
  },

  '@media (min-width: 1200px)': {
    width: '80%',
    h2: {
      fontSize: '1.25rem',
    },

    p: {
      fontSize: '1rem',
    },
  },
})
