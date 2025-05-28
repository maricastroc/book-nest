export function formatStatusForAPI(
  status: 'read' | 'reading' | 'want_to_read' | 'did_not_finish',
): string {
  const statusMap: Record<typeof status, string> = {
    read: 'Read',
    reading: 'Reading',
    want_to_read: 'Want to Read',
    did_not_finish: 'Did not Finish',
  }

  return statusMap[status]
}
