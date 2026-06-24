import { styled } from '@/styles'

export const FeedLayout = styled('div', {
  display: 'flex',
  gap: '2rem',
  width: '100%',
  marginTop: '2rem',
  paddingBottom: '2.5rem',
  alignItems: 'flex-start',

  '@media (min-width: 768px)': {
    height: '84vh',
  },
})

export const FeedMain = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  flex: 1,
  minWidth: 0,

  '@media (min-width: 768px)': {
    overflowY: 'scroll',
    height: '100%',
    paddingRight: '0.5rem',
  },
})

export const PageSubtitle = styled('p', {
  fontSize: '$sm',
  marginTop: '-0.35rem',
  marginBottom: '0.45rem',
})

// ── Filter tabs ───────────────────────────────────────────────

export const FilterTabs = styled('div', {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '0.5rem',
  flexWrap: 'wrap',
})

export const FilterTab = styled('button', {
  padding: '0.4rem 1rem',
  borderRadius: 99,
  fontSize: '0.82rem',
  fontWeight: 500,
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 150ms',

  variants: {
    active: {
      true: {
        backgroundColor: '$purple200',
        color: '$white',
        border: '1px solid $purple200',
      },
      false: {
        backgroundColor: 'transparent',
        color: '$gray400',
        border: '1px solid $gray600',

        '&:hover': {
          borderColor: '$gray400',
          color: '$gray200',
        },
      },
    },
  },

  defaultVariants: { active: false },
})

// ── Activity card ─────────────────────────────────────────────

export const ActivityCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$gray700',
  borderRadius: 12,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'background 150ms',

  '&:hover': {
    backgroundColor: '$gray650',
  },
})

export const ActivityCardHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.9rem 1.25rem',
  backgroundColor: '$gray650',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
})

export const ActivityUserName = styled('span', {
  fontSize: '0.9rem',
  fontWeight: 700,
  color: '$gray100',
  flex: 1,

  '&:hover': { color: '$purple100' },
})

export const ActivityTimestamp = styled('time', {
  fontSize: '0.72rem',
  color: '$gray400',
  whiteSpace: 'nowrap',
})

export const ActivityCardBody = styled('div', {
  display: 'flex',
  gap: '1.25rem',
  padding: '1.25rem',
  alignItems: 'flex-start',
})

export const BookCoverWrap = styled('div', {
  flexShrink: 0,

  img: {
    width: '5rem',
    height: 'auto',
    borderRadius: 8,
    display: 'block',
    boxShadow: '0px 6px 14px rgba(0,0,0,0.55)',
    transition: 'filter 150ms',
  },

  '&:hover img': {
    filter: 'brightness(1.12)',
  },
})

export const BookInfo = styled('div', {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
})

export const BookTitle = styled('h3', {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '$gray100',
  lineHeight: 1.3,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
})

export const BookAuthor = styled('p', {
  fontSize: '0.78rem',
  color: '$gray400',
  marginBottom: '0.15rem',
})

export const ActivityLabel = styled('p', {
  fontSize: '0.75rem',
  color: '$gray400',
  marginTop: '0.4rem',

  span: {
    color: '$purple100',
    fontStyle: 'italic',
  },
})

export const ReviewText = styled('p', {
  fontSize: '0.82rem',
  color: '$gray300',
  lineHeight: 1.6,
  marginTop: '0.5rem',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

// ── Featured card (first activity) ───────────────────────────

export const FeaturedCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$gray700',
  borderRadius: 12,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'background 150ms',
  marginBottom: '0.25rem',

  '&:hover': {
    backgroundColor: '$gray650',
  },
})

export const FeaturedCardHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  padding: '1rem 1.5rem',
  backgroundColor: '$gray650',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
})

export const FeaturedCardBody = styled('div', {
  display: 'flex',
  gap: '1.5rem',
  padding: '1.5rem',
  alignItems: 'flex-start',
})

export const FeaturedBookCover = styled('div', {
  flexShrink: 0,

  img: {
    width: '7rem',
    height: 'auto',
    borderRadius: 10,
    display: 'block',
    boxShadow: '0px 8px 20px rgba(0,0,0,0.6)',
    transition: 'filter 150ms',
  },

  '&:hover img': {
    filter: 'brightness(1.12)',
  },
})

export const FeaturedBookInfo = styled('div', {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
})

export const FeaturedBookTitle = styled('h3', {
  fontSize: '1.05rem',
  fontWeight: 700,
  color: '$gray100',
  lineHeight: 1.3,
})

export const FeaturedBookAuthor = styled('p', {
  fontSize: '0.82rem',
  color: '$gray400',
  marginBottom: '0.1rem',
})

export const FeaturedReviewText = styled('p', {
  fontSize: '0.85rem',
  color: '$gray300',
  lineHeight: 1.65,
  marginTop: '0.6rem',
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

// ── Right sidebar ─────────────────────────────────────────────

export const FeedSidebar = styled('aside', {
  display: 'none',
  flexDirection: 'column',
  gap: '1rem',
  width: '15rem',
  flexShrink: 0,

  '@media (min-width: 1024px)': {
    display: 'flex',
    overflowY: 'auto',
    height: '84vh',
  },

  '@media (min-width: 1200px)': {
    width: '16rem',
  },
})

export const SidebarWidget = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  backgroundColor: '$gray700',
  borderRadius: 12,
  padding: '1.25rem',
})

export const WidgetHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '0.25rem',
})

export const WidgetTitle = styled('p', {
  fontSize: '0.82rem',
  fontWeight: 700,
  color: '$gray100',
})

export const WidgetSeeAll = styled('span', {
  fontSize: '0.72rem',
  color: '$purple100',
  cursor: 'pointer',
  fontWeight: 500,

  '&:hover': { textDecoration: 'underline' },
})

export const SuggestedUserRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  padding: '0.4rem 0',
  borderBottom: '1px solid rgba(255,255,255,0.04)',

  '&:last-child': {
    borderBottom: 'none',
    paddingBottom: 0,
  },
})

export const SuggestedUserInfo = styled('div', {
  flex: 1,
  minWidth: 0,
})

export const SuggestedUserName = styled('p', {
  fontSize: '0.82rem',
  color: '$gray100',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const FollowBtn = styled('button', {
  flexShrink: 0,
  fontSize: '0.72rem',
  fontWeight: 600,
  padding: '0.28rem 0.7rem',
  borderRadius: 99,
  cursor: 'pointer',
  transition: 'all 150ms',

  variants: {
    following: {
      true: {
        backgroundColor: 'transparent',
        color: '$gray300',
        border: '1px solid $gray500',

        '&:hover': {
          borderColor: '$red300',
          color: '$red300',
        },
      },
      false: {
        backgroundColor: '$purple200',
        color: '$white',
        border: '1px solid $purple200',

        '&:hover': {
          backgroundColor: '$purple100',
        },
      },
    },
  },

  defaultVariants: { following: false },
})

export const InviteCard = styled('div', {
  backgroundColor: '$gray700',
  borderRadius: 12,
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',

  h4: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '$gray100',
  },

  p: {
    fontSize: '0.75rem',
    color: '$gray400',
    lineHeight: 1.55,
  },
})

export const CopyLinkBtn = styled('button', {
  marginTop: '0.25rem',
  padding: '0.55rem',
  borderRadius: 8,
  borderColor: 'transparent',
  backgroundColor: '$purple200',
  color: '$white',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 150ms',

  '&:hover': { backgroundColor: '$purple100' },
})

// ── Empty state ───────────────────────────────────────────────

export const EmptyFeedContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '4rem 1rem',
  textAlign: 'center',
  color: '$gray400',

  p: {
    fontSize: '0.95rem',
    maxWidth: '22rem',
    lineHeight: 1.6,
  },
})
