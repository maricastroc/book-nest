import { format, formatDistanceToNow } from 'date-fns'

export function getDateFormattedAndRelative(date: string | Date) {
  const dateObj = new Date(date)

  const dateFormatted = format(dateObj, "d 'de' LLLL 'às' HH:mm'h'")
  const dateRelativeToNow = formatDistanceToNow(dateObj, {
    addSuffix: true,
  })

  const dateString = new Date(dateObj).toISOString()

  return {
    dateFormatted,
    dateRelativeToNow,
    dateString,
  }
}
