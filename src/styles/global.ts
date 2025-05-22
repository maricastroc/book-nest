import { globalCss } from '.'

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',

    '&:focus': {
      border: '1px solid $purple100',
      outlineColor: '$purple100',
    },
  },

  body: {
    backgroundColor: '$gray800',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
    minHeight: '100vh',
    maxWidth: '100vw',
    overflowX: 'hidden',

    input: {
      colorScheme: 'dark !important',

      '&:focus': {
        backgroundColor: 'transparent',
        outline: 'none',
        boxShadow: 'none',
        outlineColor: '$purple100',
      },
    },

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

    'input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button':
      {
        WebkitAppearance: 'none',
        margin: 0,
      },
    'input[type=number]': {
      MozAppearance: 'textfield',
    },
  },

  'body, input, textarea, button': {
    fontFamily: 'Nunito sans, sans-serif',
    fontWeight: 400,
  },

  'input:-webkit-autofill': {
    backgroundColor: '$gray700 !important',
    '-webkit-text-fill-color': 'white !important',
    '-webkit-box-shadow': '0 0 0px 1000px $gray700 inset !important',
    transition: 'background-color 5000s ease-in-out 0s !important',
  },
  'input:-webkit-autofill:hover': {
    backgroundColor: '$gray700 !important',
    '-webkit-text-fill-color': 'white !important',
    '-webkit-box-shadow': '0 0 0px 1000px $gray700 inset !important',
  },
  'input:-webkit-autofill:focus': {
    backgroundColor: '$gray700 !important',
    '-webkit-text-fill-color': 'white !important',
    '-webkit-box-shadow': '0 0 0px 1000px $gray700 inset !important',
  },
  '& textarea:-webkit-autofill': {
    '-webkit-box-shadow': '0 0 0px 1000px transparent inset !important',
    '-webkit-text-fill-color': 'white !important',
    transition: 'background-color 5000s ease-in-out 0s',
  },
  '& select:-webkit-autofill': {
    '-webkit-box-shadow': '0 0 0px 1000px transparent inset !important',
    '-webkit-text-fill-color': 'white !important',
    transition: 'background-color 5000s ease-in-out 0s',
  },
})
