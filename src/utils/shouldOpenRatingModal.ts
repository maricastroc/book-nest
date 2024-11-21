import { formatToSnakeCase } from './formatToSnakeCase'

export function shouldOpenRatingModal(
  statusLabel: string,
  activeStatus: string | null,
): boolean {
  const formattedStatus = formatToSnakeCase(statusLabel)
  const formattedActiveStatus = formatToSnakeCase(activeStatus ?? '')

  return (
    (formattedStatus === 'read' && formattedActiveStatus !== 'read') ||
    (formattedStatus === 'did_not_finish' &&
      formattedActiveStatus !== 'did_not_finish')
  )
}
