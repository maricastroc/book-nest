import { styled } from '@/styles'

export const LayoutWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1.5rem',
  minWidth: '100vw',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '100vw',
  overflowX: 'hidden',

  '@media (min-width: 768px)': {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: '0 2rem 0 1rem',
  },

  '@media (min-width: 1024px)': {
    gap: '3rem',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: '100%',
  },

  '@media (min-width: 1440px)': {
    gap: '5rem',
    paddingRight: '2rem',
  },

  variants: {
    variant: {
      secondary: {
        '@media (min-width: 1024px)': {
          maxHeight: '100vh',
          overflowY: 'hidden',
        },
      },
      primary: {
        '@media (min-width: 1200px)': {
          maxHeight: '100vh',
          overflowY: 'hidden',
        },
      },
      tertiary: {
        '@media (min-width: 1024px)': {
          maxHeight: '100vh',
          overflowY: 'hidden',
        },
      },
    },
  },
})

export const LayoutContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '45rem',
  marginTop: '2rem',
  overflow: 'hidden',

  '@media (min-width: 768px)': {
    marginTop: '2.5rem',
    alignItems: 'flex-start',
    padding: '0 0 0 2rem',
    maxWidth: '100%',
    paddingLeft: '15.2rem',
  },

  '@media (min-width: 980px)': {
    paddingLeft: '18rem',
  },

  '@media (min-width: 1024px)': {
    paddingBottom: '1rem',
    overflow: 'scroll',
  },

  '@media (min-width: 1200px)': {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0 0 0 2rem',
    maxWidth: '100%',
    paddingLeft: '18rem',
  },

  variants: {
    variant: {
      secondary: {
        '@media (min-width: 768px)': {
          maxHeight: '100vh',
          overflowY: 'hidden',
        },
      },
      primary: {
        '@media (min-width: 1200px)': {
          maxHeight: '100vh',
          overflowY: 'hidden',
        },
      },
      tertiary: {},
    },
  },
})

export const LayoutHeading = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  alignSelf: 'start',
  gap: '1rem',
  textAlign: 'left',
  width: '100%',
  paddingTop: '4.5rem',

  '@media (min-width: 480px)': {
    paddingTop: '6.5rem',
  },

  '@media (min-width: 768px)': {
    paddingTop: 0,
  },

  '@media (min-width: 1024px)': {
    flexDirection: 'row',
  },
})

export const TitleWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.8rem',

  h2: {
    fontSize: '1.3rem',
  },

  svg: {
    fontSize: '1.8rem',
    color: '$green100',
  },

  '@media (min-width: 480px)': {
    h2: {
      fontSize: '1.5rem',
    },

    svg: {
      fontSize: '2rem',
    },
  },
})
