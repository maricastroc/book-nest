import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container } from './styles'

interface Props {
  readingStatus: 'read' | 'reading' | 'wantToRead' | 'didNotFinish' | null
  type?: 'relative' | 'absolute'
}

export function ReadingStatusTag({ readingStatus, type = 'absolute' }: Props) {
  return (
    readingStatus && (
      <Container status={readingStatus} type={type}>
        <FontAwesomeIcon icon={faBookmark} />
      </Container>
    )
  )
}
