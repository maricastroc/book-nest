import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const STATUS_COLORS: Record<string, string> = {
  read: 'var(--color-st-read)',
  reading: 'var(--color-st-reading)',
  wantToRead: 'var(--color-st-want)',
  didNotFinish: 'var(--color-st-dnf)',
}

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
  if (!readingStatus) return null

  const color = STATUS_COLORS[readingStatus]

  if (type === 'absolute') {
    return (
      <span
        className="absolute right-0 top-[-0.3rem] rounded-[0_8px_0_8px] px-2 py-0.5 text-[1.1rem] font-bold"
        style={{ color }}
      >
        <FontAwesomeIcon icon={faBookmark} />
      </span>
    )
  }

  return (
    <span
      className={isSmaller ? 'text-[0.92rem]' : 'text-base'}
      style={{ color }}
    >
      <FontAwesomeIcon icon={faBookmark} />
    </span>
  )
}
