/* eslint-disable @typescript-eslint/no-explicit-any */
import { styled } from '@/styles'

const gridBreakpoints = {
  0: 2,
  380: 3,
  530: 4,
  640: 5,
  770: 4,
  880: 5,
  1070: 6,
  1180: 7,
  1200: 4,
  1270: 5,
  1430: 6,
  1800: 7,
}

const responsiveGrid = Object.entries(gridBreakpoints).reduce(
  (acc, [bp, cols]) => {
    acc[`@media (min-width: ${bp}px)`] = {
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
    }
    return acc
  },
  {} as Record<string, any>,
)

export const BooksGridWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  padding: '1rem 0 1rem 0',

  '@media (min-width: 1024px)': {
    height: '100vh',
    overflow: 'scroll',
    padding: '0 1rem 9rem',
    paddingLeft: 0,
  },

  '@media (min-width: 1200px)': {
    height: '100vh',
    overflow: 'scroll',
  },
})

export const BooksGridHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '1rem',
})

export const BooksGridMain = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  marginTop: '1rem',
})

export const BooksGridContent = styled('div', {
  display: 'grid',
  gap: '0.65rem',
  justifyContent: 'center',
  padding: '2rem 0.5rem',
  borderRadius: 12,
  backgroundColor: '$gray700',
  alignContent: 'flex-start',
  width: '100%',
  gridTemplateColumns: 'repeat(2, 1fr)',
  ...responsiveGrid,

  '@media (min-width: 480px)': {
    padding: '2rem 1rem',
  },
})

export const TagStatus = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '0.7rem',
  fontWeight: 600,
  borderRadius: 15,
  color: '$gray300',

  svg: {
    color: '$green100',
    fontSize: '1.05rem',
  },

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
