import { READING_STATUS, WANT_TO_READ_STATUS } from '@/utils/constants'

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
  if (activeStatus !== READING_STATUS && activeStatus !== WANT_TO_READ_STATUS) {
    return null
  }

  return (
    <div
      style={style}
      className={`mt-4 w-full rounded-r-xl border-l-4 border-st-read bg-el px-3 py-3 ${
        className ?? ''
      }`}
    >
      <p className="text-[0.85rem] leading-relaxed text-fg2">
        <strong className="font-bold text-st-read">Note:</strong>{' '}
        {`Hidden while book status is "Reading" or "Want to Read". Will reappear if set to "Read" or "Did Not Finish".`}
      </p>
    </div>
  )
}
