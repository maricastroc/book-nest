export const getReadingStatusLabel = (
  readingStatus: string | null | undefined,
) => {
  if (!readingStatus) {
    return 'ADD TO LIBRARY'
  }

  switch (readingStatus) {
    case 'read':
    case 'Read':
      return 'Read'
    case 'reading':
    case 'Reading':
      return 'Reading'
    case 'wantToRead':
    case 'Want to Read':
      return 'Want to Read'
    case 'didNotFinish':
    case 'Did not Finish':
      return 'Did not Finish'
    default:
      return 'Add to Library'
  }
}
