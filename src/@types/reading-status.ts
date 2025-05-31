export const statuses = [
  { label: 'Read', value: 'read' },
  { label: 'Reading', value: 'reading' },
  { label: 'Did not Finish', value: 'didNotFinish' },
  { label: 'Want to Read', value: 'wantToRead' },
] as const

export type ReadingStatus = (typeof statuses)[number]['value']
