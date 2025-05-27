import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container } from './styles'

interface Props {
  readingStatus: string
}

export function ReadingStatusTag({ readingStatus }: Props) {
  return (
    <Container className={readingStatus}>
      <FontAwesomeIcon icon={faBookmark} />
    </Container>
  )
}
