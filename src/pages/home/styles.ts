import { styled } from '@/styles'
import { ToastContainer } from 'react-toastify'

export const HomePageWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  minWidth: '100vw',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '100vw',
  overflowX: 'hidden',

  '@media (min-width: 768px)': {
    flexDirection: 'row',
    height: '97vh',
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
    paddingRight: '5rem',
  },
})

export const HomePageContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '45rem',
  marginTop: '2rem',
  overflowY: 'hidden',

  '@media (min-width: 480px)': {
    padding: '0 2rem',
  },

  '@media (min-width: 768px)': {
    marginTop: '2.5rem',
    alignItems: 'flex-start',
    padding: '0 0 0 2rem',
    maxWidth: '100%',
    paddingLeft: '18rem',
  },

  '@media (min-width: 1024px)': {
    overflowY: 'hidden',
    paddingBottom: '1rem',
  },

  '@media (min-width: 1200px)': {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0 0 0 2rem',
    maxWidth: '100%',
    paddingLeft: '18rem',
  },

  '@media (min-width: 1400px)': {
    paddingLeft: '21rem',
  },
})

export const HomePageHeading = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  alignSelf: 'start',
  gap: '0.8rem',
  textAlign: 'left',
  marginBottom: '2.5rem',
  width: '100%',

  h2: {
    fontSize: '1.5rem',
  },

  svg: {
    fontSize: '2rem',
    color: '$green100',
  },
})

export const HomePageContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 768px)': {
    justifyContent: 'flex-start',
    overflowY: 'scroll',
  },

  '@media (min-width: 1024px)': {
    height: '82vh',
  },

  '@media (min-width: 1200px)': {
    overflowY: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: '2.5rem',
    height: '82vh',
  },

  '@media (min-width: 1440px)': {
    gap: '4rem',
  },
})

export const LastRatingsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',

  '@media (min-width: 768px)': {
    paddingRight: '1rem',
  },

  '@media (min-width: 1200px)': {
    overflowY: 'scroll',
    height: '100%',
  },
})

export const UserLatestReadingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '1rem',
})

export const UserLatestReadingTitle = styled('p', {
  fontSize: '$sm',
  marginBottom: '1rem',
})

export const LastRatingsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  minWidth: '100%',
})

export const LastRatingsContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
})

export const LastRatingsTitle = styled('p', {
  fontSize: '$sm',
})

export const PopularBooksWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '2.5rem',
  marginBottom: '2rem',
  width: '100%',
  gap: '1rem',

  '@media (min-width: 768px)': {
    paddingRight: '1rem',
  },

  '@media (min-width: 1200px)': {
    marginTop: 0,
    marginBottom: 0,
    width: '45rem',
    overflowY: 'scroll',
    height: '100%',
  },
})

export const PopularBooksTitle = styled('div', {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',

  p: {
    fontSize: '$sm',
  },

  span: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '$sm',
    color: '$purple100',

    svg: {
      fontSize: '1rem',
      color: '$purple100',
      marginLeft: '0.4rem',
    },
  },
})

export const PopularBooksContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',

  '@media (min-width: 680px)': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },

  '@media (min-width: 768px)': {
    display: 'flex',
    flexDirection: 'column',
  },

  '@media (min-width: 910px)': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },

  '@media (min-width: 1200px)': {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
    height: '100%',
    paddingRight: '1rem',
  },
})

export const StyledToastContainer = styled(ToastContainer, {
  '& .Toastify__toast': {
    backgroundColor: '$gray700',
    color: '$gray200',
    borderRadius: 4,
    fontFamily: 'Nunito sans, sans-serif',
    fontSize: '0.95rem',
    zIndex: 9999,
  },

  '& .Toastify__close-button': {
    color: '$white',
    zIndex: 9999,
  },

  '& .Toastify__toast-body svg': {
    fill: '$purple100',
    fontSize: '0.5rem',
    zIndex: 9999,
  },

  '& .Toastify__progress-bar': {
    backgroundColor: '$purple100',
    zIndex: 9999,
  },
})
