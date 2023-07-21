import { styled } from '../../styles'
import { ToastContainer } from 'react-toastify'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',

  '@media (min-width: 480px)': {
    padding: '0 2rem',
  },

  '@media (min-width: 768px)': {
    flexDirection: 'row',
    height: '97vh',
    alignItems: 'stretch',
    padding: '0 2rem 0 1rem',
  },

  '@media (min-width: 1024px)': {
    gap: '5rem',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingRight: '5rem',
  },
})

export const HomeContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '35rem',
  marginTop: '2rem',

  '@media (min-width: 480px)': {
    padding: '0 2rem',
  },

  '@media (min-width: 768px)': {
    alignItems: 'flex-start',
    padding: '0 0 0 2rem',
    maxWidth: '40rem',
  },

  '@media (min-width: 1200px)': {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0 0 0 2rem',
    maxWidth: '100%',
    overflowY: 'scroll',
  },
})

export const HomeContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 768px)': {
    justifyContent: 'flex-start',
    overflowY: 'scroll',
  },

  '@media (min-width: 1200px)': {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: '4rem',
    height: '82vh',
  },
})

export const RecentAndLastRead = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',

  '@media (min-width: 1200px)': {
    overflowY: 'scroll',
    maxHeight: '100vh',
    paddingRight: '1rem',
  },
})

export const Heading = styled('div', {
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

export const LastReadContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '1rem',
})

export const LastReadTitle = styled('p', {
  fontSize: '$sm',
})

export const RecentCardsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '2.5rem',
  gap: '1rem',
})

export const RecentCardsContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
})

export const RecentCardsTitle = styled('p', {
  fontSize: '$sm',
})

export const PopularBooksCardsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '5rem',
  width: '100%',
  gap: '1rem',

  '@media (min-width: 1200px)': {
    marginTop: 0,
    width: '25rem',
    overflowY: 'scroll',
    paddingRight: '1rem',
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

export const PopularBooksCardsContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',

  '@media (min-width: 1200px)': {
    overflowY: 'scroll',
  },
})

export const StyledToastContainer = styled(ToastContainer, {
  '& .Toastify__toast': {
    backgroundColor: '$gray700',
    color: '$gray200',
    borderRadius: 4,
    fontFamily: 'Nunito, sans-serif',
  },

  '& .Toastify__close-button': {
    color: '$white',
  },

  '& .Toastify__toast-body svg': {
    fill: '$purple100',
    fontSize: '0.5rem',
  },

  '& .Toastify__progress-bar': {
    backgroundColor: '$purple100',
  },
})
