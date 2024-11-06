import { styled } from '../../../../styles'

export const BookCardWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$gray700',
  padding: '1.5rem',
  borderRadius: 8,
  width: '100%',

  '@media (min-width: 580px)': {
    padding: '1.5rem 2rem',
  },
})

export const BookCardContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  gap: '1.5rem',

  '@media (min-width: 580px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: '2rem',
  },
})

export const BookCover = styled('img', {
  width: 120,
  height: 'auto',
  borderRadius: 8,
  opacity: 0.9,

  '@media (min-width: 480px)': {
    width: 135,
  },

  '@media (min-width: 580px)': {
    width: 140,
  },
})

export const BookDetailsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
  width: '100%',
  gap: '1.5rem',

  '@media (min-width: 580px)': {
    flexDirection: 'flex-start',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100%',
    marginTop: 0,
  },
})

export const BookTitleAndAuthor = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',

  h2: {
    fontSize: '1.15rem',
    maxHeight: '4.5rem',
    whiteSpace: 'break-spaces',
    overflow: 'scroll',
    position: 'relative',
  },

  p: {
    color: '$gray300',
    fontSize: '0.95rem',
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
    textAlign: 'left',

    h2: {
      fontSize: '1.5rem',
      maxHeight: '100%',
    },

    p: {
      color: '$gray300',
      fontSize: '1.1rem',
    },
  },
})

export const BookOtherInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
})

export const BookRatingInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',

  p: {
    color: '$gray100',
    fontSize: '0.95rem',
    fontWeight: 700,
  },
})

export const BookRatingAndReviews = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.6rem',

  p: {
    color: '$gray300',
    fontSize: '0.85rem',
  },

  '@media (min-width: 580px)': {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',

    p: {
      fontSize: '0.9rem',
    },
  },
})

export const BookStatsWrapper = styled('footer', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '1rem',

  '@media (min-width: 480px)': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    width: '100%',
  },
})

export const StatWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',

  svg: {
    fontSize: '1.5rem',
    color: '$green100',
  },

  '@media (min-width: 480px)': {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0.5rem',

    svg: {
      fontSize: '1.7rem',
    },
  },

  '@media (min-width: 680px)': {
    svg: {
      fontSize: '1.9rem',
    },
  },
})

export const StatText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  alignItems: 'flex-start',

  p: {
    fontSize: '$sm',
    color: '$gray300',
  },

  h2: {
    fontSize: '0.95rem',
    color: '$white',
  },

  '@media (min-width: 480px)': {
    alignItems: 'center',
    textAlign: 'center',
  },

  '@media (min-width: 680px)': {
    h2: {
      fontSize: '1.1rem',
      color: '$white',
    },
  },
})

export const DividerLine = styled('span', {
  width: '100%',
  height: 0.5,
  backgroundColor: '$gray600',
  margin: '1rem 0',
})

export const AddToLibrarySection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '1.5rem',
  width: '100%',
  gap: '0.5rem',
})

export const AddToLibraryButton = styled('button', {
  color: '$green100',
  width: '100%',
  textAlign: 'center',
  padding: '0.5rem',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: '1px solid $green100',
  fontSize: '0.9rem',

  '&:hover': {
    backgroundColor: '$green200',
    transition: 'all 200ms',
    border: '1px solid $green200',
    color: '$gray100',
  },

  '&:selected': {
    backgroundColor: '$green200',
    transition: 'all 200ms',
    border: '1px solid $green200',
    color: '$gray100',
  },
})

export const AddToLibraryDropdown = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: '$gray600',
  border: '1px solid $gray500',
  width: '100%',
  zIndex: 999,
})

export const ReadingStatusItem = styled('button', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.9rem',
  color: '$gray100',
  width: '100%',
  border: 'transparent',
  backgroundColor: 'transparent',
  height: '2.6rem',
  justifyContent: 'space-between',
  padding: '0 1.5rem',

  svg: {
    '&.read': {
      color: '$read',
    },

    '&.wantread': {
      color: '$wantread',
    },

    '&.reading': {
      color: '$reading',
    },

    '&.dnf': {
      color: '$dnf',
    },
  },
})

export const DividerDropdown = styled('span', {
  width: '100%',
  height: 0.2,
  backgroundColor: '$gray500',
  margin: 0,
  padding: 0,
})
