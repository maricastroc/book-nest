export function calculateReadingTime(
  totalPages: number,
  wordsPerPage = 275,
  wordsPerMinute = 250,
): string {
  const totalWords = totalPages * wordsPerPage
  const readingTimeMinutes = totalWords / wordsPerMinute

  const hours = Math.floor(readingTimeMinutes / 60)
  const minutes = Math.ceil(readingTimeMinutes % 60)

  const hoursPart = hours > 0 ? `${hours}h` : ''
  const minutesPart = minutes > 0 ? `${minutes}min` : ''

  return `${hoursPart}${minutesPart}`
}
