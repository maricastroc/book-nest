export function formatToSnakeCase(text: string): string {
  return text?.toLowerCase()?.replace(/\s+/g, '_')
}
