import { createStitches } from '@stitches/react'

export const {
  config,
  styled,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  css,
} = createStitches({
  theme: {
    colors: {
      white: '#FFFFFF',
      black: '#000000',

      green100: '#50B2C0',
      green200: '#255D6A',
      green300: '#0A313C',

      purple50: '#B2AFF0',
      purple80: '#7f7cff',
      purple100: '#8381D9',
      purple200: '#4F47A3',
      purple300: '#2A2879',
      purple400: '#1F1D5C',

      gray100: '#F8F9FC',
      gray200: '#E6E8F2',
      gray300: '#D1D6E4',
      gray400: '#8D95AF',
      gray500: '#303F73',
      gray600: '#252D4A',
      gray650: '#20263f',
      gray700: '#181C2A',
      gray750: '#121520',
      gray800: '#0E1116',

      reading: '#4F72D5',
      dnf: '#B04B4B',
      read: '#2FA6A3',
      wantread: '#B29B3A',

      'gradient-vertical': `linear-gradient(180deg, #7FD1CC 0%, #9694F5 100%)`,
      'gradient-horizontal': `linear-gradient(90deg, #7FD1CC 0%, #9694F5 100%)`,
    },

    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
  },
})
