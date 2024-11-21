import { DID_NOT_FINISH_STATUS, READ_STATUS } from './constants'
import { formatToSnakeCase } from './formatToSnakeCase'

export function shouldOpenRatingModal(
  statusLabel: string,
  activeStatus: string | null,
): boolean {
  const formattedStatus = formatToSnakeCase(statusLabel)
  const formattedActiveStatus = formatToSnakeCase(activeStatus ?? '')

  return (
    (formattedStatus === READ_STATUS &&
      formattedActiveStatus !== READ_STATUS &&
      formattedActiveStatus !== DID_NOT_FINISH_STATUS) ||
    (formattedStatus === DID_NOT_FINISH_STATUS &&
      formattedActiveStatus !== DID_NOT_FINISH_STATUS &&
      formattedActiveStatus !== READ_STATUS)
  )
}
