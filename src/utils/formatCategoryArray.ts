export function formatCategoryArray<T>(
  a: T[] | undefined,
  b: T[] | undefined,
): boolean {
  if (!a || !b) return false
  if (a.length !== b.length) return false
  return a.every((val, index) => val === b[index])
}
