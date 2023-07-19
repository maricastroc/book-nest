import { styled } from '../../styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (min-width: 480px)': {
    padding: '0 2rem',
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
})

export const Heading = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  alignSelf: 'start',
  gap: '0.8rem',
  textAlign: 'left',
  marginBottom: '2.5rem',

  h2: {
    fontSize: '1.5rem',
  },

  svg: {
    fontSize: '2rem',
    color: '$green100',
  },
})

export const RecentCardsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
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
})
