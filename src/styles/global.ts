import { globalCss } from '.'

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  body: {
    backgroundColor: '#0c0c0e',
    color: '#f3f3f4',
    fontFamily: 'Inter, system-ui, sans-serif',
    '-webkit-font-smoothing': 'antialiased',
    minHeight: '100vh',
    maxWidth: '100vw',
    overflowX: 'hidden',
  },

  'body, input, textarea, button': {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: 400,
  },

  button: {
    appearance: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 0,
    font: 'inherit',
    color: 'inherit',
    cursor: 'pointer',
  },

  a: {
    color: 'inherit',
    textDecoration: 'none',
  },

  input: {
    colorScheme: 'dark',
  },

  'input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button':
    {
      WebkitAppearance: 'none',
      margin: 0,
    },

  'input[type=number]': {
    MozAppearance: 'textfield',
  },

  '*::-webkit-scrollbar': {
    width: 4,
    height: 4,
  },

  '*::-webkit-scrollbar-corner': {
    backgroundColor: 'transparent',
  },

  '*::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 999,
  },

  'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus':
    {
      backgroundColor: '#1a1a1e !important',
      WebkitTextFillColor: '#f3f3f4 !important',

      transition: 'background-color 5000s ease-in-out 0s !important',
    },

  'textarea:-webkit-autofill, select:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0px 1000px transparent inset !important',
    WebkitTextFillColor: '#f3f3f4 !important',
    transition: 'background-color 5000s ease-in-out 0s',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid #e8b14c',
    outlineOffset: 2,
  },
})
