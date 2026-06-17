import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container } from './styles'

interface Props {
  readingStatus: 'read' | 'reading' | 'wantToRead' | 'didNotFinish' | null
  type?: 'relative' | 'absolute'
  isSmaller?: boolean
}

export function ReadingStatusTag({
  readingStatus,
  type = 'absolute',
  isSmaller = false,
}: Props) {
  return (
    readingStatus && (
      <Container
        className={isSmaller ? 'smaller' : ''}
        status={readingStatus}
        type={type}
      >
        <FontAwesomeIcon icon={faBookmark} />
      </Container>
    )
  )
}
