export function formatDate(dateString: string): string {
  const [year] = dateString.split('-')

  return `${year}`
}
