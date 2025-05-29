import { StyledArchivedWarning } from './styles'

interface ArchivedWarningProps {
  style?: React.CSSProperties
  className?: string
}

export const ArchivedWarning = ({ style, className }: ArchivedWarningProps) => {
  return (
    <StyledArchivedWarning style={style} className={className}>
      <p>
        <strong>Note:</strong>{' '}
        {`Hidden while book status is "Reading" or "Want to Read". 
        Will reappear if set to "Read" or "Did Not Finish".`}
      </p>
    </StyledArchivedWarning>
  )
}
