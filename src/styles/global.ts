import { globalCss } from '.'

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  body: {
    backgroundColor: '$gray800',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
    minHeight: '100vh',
    maxWidth: '100vw',
    overflowX: 'hidden',

    '*::-webkit-scrollbar': {
      width: 2,
      height: 2,
      borderRadius: 9999,
    },

    '*::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },

    '*::-webkit-scrollbar-thumb': {
      width: 6,
      backgroundColor: '$gray500',
      borderRadius: 80,
      boxShadow: 'inset 0 0 0px 6px $gray500',
      border: '10px solid transparent',
    },
  },

  'body, input, textarea, button': {
    fontFamily: 'Nunito sans, sans-serif',
    fontWeight: 400,
  },
})
