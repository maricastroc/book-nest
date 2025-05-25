/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatCategoryArray(
  a: any[] | undefined,
  b: any[] | undefined,
): boolean {
  if (!a || !b) return false
  if (a.length !== b.length) return false
  return a.every((val, index) => val === b[index])
}
