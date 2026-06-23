import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  width: '100%',
  height: '100vh',

  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    height: 'auto',
    minHeight: '100vh',
  },
})

export const LeftPanel = styled('div', {
  backgroundColor: '$gray800',
  padding: '3rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  overflow: 'hidden',
  height: '100%',

  '@media (max-width: 768px)': {
    display: 'none',
  },
})

export const LogoWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.625rem',
  zIndex: 2,
  position: 'relative',
})

export const HeroText = styled('div', {
  zIndex: 2,
  position: 'relative',

  h1: {
    color: '$white',
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: 1.4,
    marginBottom: '0.375rem',

    span: { color: '$purple100' },
  },

  p: {
    color: '$gray400',
    fontSize: '0.8125rem',
    lineHeight: 1.6,
  },
})

export const RightPanel = styled('div', {
  backgroundColor: '$gray700',
  padding: '3rem',
  paddingBottom: '5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',
  overflowY: 'auto',

  '@media (max-width: 768px)': {
    backgroundColor: '$gray700',
    padding: '0',
    justifyContent: 'flex-start',
  },
})

export const DesktopForm = styled('div', {
  width: '100%',

  '@media (max-width: 768px)': {
    display: 'none',
  },
})

export const MobileHero = styled('div', {
  display: 'none',

  '@media (max-width: 768px)': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    padding: '3.5rem 2rem 2.5rem',
    gap: '1.25rem',
  },
})

export const MobileLogoBlock = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export const MobileSlogan = styled('div', {
  h2: {
    color: '$gray200',
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.4,

    span: { color: '$purple100' },
  },

  p: {
    color: '$gray400',
    fontSize: '0.8125rem',
    lineHeight: 1.6,
    marginTop: '0.375rem',
  },
})

export const MobileFormCard = styled('div', {
  display: 'none',

  '@media (max-width: 768px)': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    backgroundColor: '$gray700',
    borderRadius: '0',
    padding: '0.5rem 1.5rem 3rem',
  },
})
