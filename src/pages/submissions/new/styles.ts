import { styled, keyframes } from '@/styles'

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const PageWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '960px',
  gap: '1.5rem',
  paddingBottom: '6rem',
  paddingTop: '1.75rem',
  animation: `${fadeIn} 200ms ease`,

  '@media (min-width: 768px)': {
    paddingRight: '1rem',
    overflowY: 'scroll',
  },
})

/* ─── Step bar ─── */

export const StepBar = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

export const StepItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

export const StepDot = styled('div', {
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: '50%',
  border: '1.5px solid $blue600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.7rem',
  fontWeight: 700,
  flexShrink: 0,
  color: '$gray400',
  transition: 'all 200ms ease',

  '&.active': {
    borderColor: 'transparent',
    backgroundColor: '$purple100',
    color: '$white',
  },

  '&.done': {
    borderColor: 'transparent',
    backgroundColor: '$green100',
    color: '$gray700',
  },
})

export const StepLabel = styled('span', {
  fontSize: '0.8rem',
  color: '$blue600',
  transition: 'color 200ms ease',

  '&.active': {
    color: '$purple50',
    fontWeight: 500,
  },

  '&.done': {
    color: '$green100',
  },
})

export const StepConnector = styled('div', {
  height: '1.5px',
  width: '2rem',
  backgroundColor: '$blue600',
  borderRadius: 4,
  transition: 'background-color 300ms ease',

  '&.done': {
    backgroundColor: '$green100',
  },
})

export const StepSubtitle = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem',
  marginTop: '-0.25rem',

  span: {
    fontSize: '0.75rem',
    color: '$blue600',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  h3: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '$gray200',
    lineHeight: 1.2,
  },
})

/* ─── Step 1: ISBN section ─── */

export const IsbnSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  backgroundColor: '$gray700',
  borderRadius: 12,
  padding: '1.5rem',
  border: '1px solid $gray600',
  animation: `${fadeIn} 200ms ease`,
})

export const IsbnRow = styled('div', {
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'flex-end',
})

export const IsbnInputWrapper = styled('div', {
  flex: 1,
})

export const IsbnHint = styled('p', {
  fontSize: '0.78rem',
  color: '$gray400',
  lineHeight: 1.6,
})

/* ─── Step 2: Book match card (compact) ─── */

export const BookMatchIntro = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  animation: `${fadeIn} 250ms ease`,

  '@media (min-width: 600px)': {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
})

export const BookMatchCard = styled('div', {
  backgroundColor: '$gray700',
  borderRadius: 12,
  border: '1px solid $gray600',
  padding: '1rem 1.25rem',
  display: 'flex',
  gap: '1rem',
  alignItems: 'flex-start',
  flex: 1,
})

export const BookCover = styled('div', {
  width: '4rem',
  height: '5.75rem',
  borderRadius: 8,
  border: '1px solid $gray600',
  backgroundColor: '$gray800',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',

  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  svg: {
    color: '$blue600',
    width: '1.5rem',
    height: '1.5rem',
  },
})

export const BookMatchInfo = styled('div', {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
})

export const BookMatchTitle = styled('h3', {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '$gray100',
  lineHeight: 1.3,
})

export const BookMatchAuthor = styled('p', {
  fontSize: '0.8rem',
  color: '$gray400',
})

export const BookMatchMeta = styled('p', {
  fontSize: '0.75rem',
  color: '$blue600',
  lineHeight: 1.5,
})

export const MatchBadge = styled('div', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.72rem',
  fontWeight: 600,
  color: '$green100',
  backgroundColor: 'rgba(80, 178, 192, 0.12)',
  borderRadius: 6,
  padding: '0.25rem 0.6rem',
  border: '1px solid rgba(80, 178, 192, 0.28)',
  alignSelf: 'flex-start',
  marginTop: 'auto',

  svg: {
    width: '0.85rem',
    height: '0.85rem',
  },
})

export const MatchMessage = styled('div', {
  backgroundColor: '$gray700',
  borderRadius: 12,
  border: '1px solid $gray600',
  padding: '1rem 1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  justifyContent: 'center',

  '@media (min-width: 600px)': {
    minWidth: '220px',
    maxWidth: '280px',
  },

  svg: {
    color: '$purple100',
    width: '1.25rem',
    height: '1.25rem',
    flexShrink: 0,
  },
})

export const MatchMessageTitle = styled('p', {
  fontSize: '0.82rem',
  fontWeight: 600,
  color: '$gray200',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
})

export const MatchMessageBody = styled('p', {
  fontSize: '0.78rem',
  color: '$gray400',
  lineHeight: 1.6,
})

/* ─── Form fields ─── */

export const SectionLabel = styled('p', {
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '$blue600',
})

export const FieldGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1rem',
  animation: `${fadeIn} 200ms ease`,

  '@media (min-width: 520px)': {
    gridTemplateColumns: '1fr 1fr',
  },
})

export const FieldFull = styled('div', {
  gridColumn: '1 / -1',
})

/* ─── Step 3: Cover upload ─── */

export const CoverUploadArea = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1.25rem',
  padding: '1rem 1.25rem',
  backgroundColor: '$gray800',
  borderRadius: 10,
  border: '1px dashed $blue600',
  cursor: 'pointer',
  transition: 'border-color 150ms, background-color 150ms',

  '&:hover': {
    borderColor: '$purple100',
    backgroundColor: '$gray700',
  },
})

export const CoverThumb = styled('div', {
  width: '4rem',
  height: '5.75rem',
  borderRadius: 6,
  backgroundColor: '$gray700',
  border: '1px solid $gray600',
  flexShrink: 0,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  svg: {
    color: '$blue600',
    width: '1.5rem',
    height: '1.5rem',
  },
})

export const CoverUploadText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',

  strong: {
    fontSize: '0.85rem',
    color: '$gray200',
    fontWeight: 600,
  },

  span: {
    fontSize: '0.75rem',
    color: '$gray400',
  },
})

/* ─── Sticky footer nav ─── */

export const NavRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  paddingTop: '0.5rem',
  marginTop: '0.5rem',
  borderTop: '1px solid $gray600',

  button: {
    width: 'auto',
    padding: '0.7rem 1.75rem',
  },
})

export const HiddenInput = styled('input', {
  display: 'none',
})
