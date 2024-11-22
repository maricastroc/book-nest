export function formatDate(dateString: string): string {
  if (!dateString) {
    return ''
  }

  const [year] = dateString.split('-')
  return `${year}`
}
