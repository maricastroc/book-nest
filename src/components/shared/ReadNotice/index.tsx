import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReadNoticeContainer } from './styles'

interface ReadNoticeProps {
  readingStatus: string
}

export function ReadNotice({ readingStatus }: ReadNoticeProps) {
  return (
    <ReadNoticeContainer className={readingStatus}>
      <FontAwesomeIcon icon={faBookmark} />
    </ReadNoticeContainer>
  )
}
