import { READING_STATUS, WANT_TO_READ_STATUS } from '@/utils/constants'
import { StyledArchivedWarning } from './styles'

interface ArchivedWarningProps {
  style?: React.CSSProperties
  className?: string
  activeStatus: string | null
}

export const ArchivedWarning = ({
  style,
  className,
  activeStatus,
}: ArchivedWarningProps) => {
  return (
    (activeStatus === READING_STATUS ||
      activeStatus === WANT_TO_READ_STATUS) && (
      <StyledArchivedWarning style={style} className={className}>
        <p>
          <strong>Note:</strong>{' '}
          {`Hidden while book status is "Reading" or "Want to Read". 
        Will reappear if set to "Read" or "Did Not Finish".`}
        </p>
      </StyledArchivedWarning>
    )
  )
}
