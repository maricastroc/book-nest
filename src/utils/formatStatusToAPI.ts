export function formatStatusForAPI(
  status: 'read' | 'reading' | 'wantToRead' | 'didNotFinish',
): string {
  const statusMap: Record<typeof status, string> = {
    read: 'Read',
    reading: 'Reading',
    wantToRead: 'Want to Read',
    didNotFinish: 'Did not Finish',
  }

  return statusMap[status]
}
