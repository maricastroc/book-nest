import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBook,
  faCircleCheck,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons'
interface Props {
  name?: string
  author?: string
  totalPages?: number | string
  publishingYear?: number | string
  publisher?: string
  language?: string
  coverPreview?: string | null
}

export function BookPreviewCard({
  name,
  author,
  totalPages,
  publishingYear,
  publisher,
  language,
  coverPreview,
}: Props) {
  const metaParts = [
    totalPages && `${totalPages} pages`,
    publishingYear,
    publisher,
    language,
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
      <div className="flex flex-1 items-start gap-5 rounded-2xl border border-line bg-s1 p-6">
        <div className="flex h-24 w-17 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-s2">
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Book cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faBook}
              className="text-fg3"
              style={{ fontSize: 24 }}
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className="text-[1rem] font-bold leading-snug text-fg">
            {name || '—'}
          </h3>
          <p className="text-[0.82rem] text-fg2">{author || '—'}</p>
          {metaParts.length > 0 && (
            <p className="text-[0.75rem] leading-relaxed text-fg3">
              {metaParts.join(' • ')}
            </p>
          )}
          <div className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-md border border-[rgba(74,158,110,0.28)] bg-[rgba(74,158,110,0.1)] px-2.5 py-1 text-[0.72rem] font-semibold text-[#4a9e6e]">
            <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 12 }} />
            Google Books match
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-2 rounded-2xl border border-line bg-s1 p-6 sm:min-w-[200px] sm:max-w-[260px]">
        <p className="flex items-center gap-2 text-[0.85rem] font-semibold text-fg">
          <FontAwesomeIcon
            icon={faWandMagicSparkles}
            className="text-ac"
            style={{ fontSize: 16 }}
          />
          Auto-filled
        </p>
        <p className="text-[0.78rem] leading-relaxed text-fg2">
          Fields were imported from Google Books. Review and correct any
          information before submitting.
        </p>
      </div>
    </div>
  )
}
