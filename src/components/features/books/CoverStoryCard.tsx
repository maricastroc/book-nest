import { StarsRating } from '@/components/features/books/StarsRating'
import { TextBox } from '@/components/features/books/TextBox'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { RatingProps } from '@/@types/rating'

interface CoverStoryCardProps {
  rating: RatingProps
  onOpenDetails: () => void
  eyebrow?: string
  reviewerName?: string
}

export function CoverStoryCard({
  rating,
  onOpenDetails,
  eyebrow = 'Cover story',
  reviewerName,
}: CoverStoryCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  if (!rating?.book) return null

  return (
    <div className="bn-scope grid grid-cols-1 overflow-hidden rounded-xl border border-ac-border bg-warm sm:grid-cols-[1fr_auto]">
      <div className="flex flex-col justify-center gap-3 p-5 sm:p-7">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ac">
          {eyebrow}
        </span>
        <div>
          <h2 className="font-serif text-[1.6rem] font-semibold leading-[1.15] text-fg">
            {rating.book.name}
          </h2>
          <p className="mt-1 text-[13px] text-fg3">{rating.book.author}</p>
        </div>
        {rating.description && (
          <TextBox description={rating.description} variant="quote" />
        )}
        <div className="flex items-center gap-3 pt-1">
          <StarsRating rating={rating.rate} size="smaller" />
          <span className="text-[11.5px] text-fg3">
            <em className="not-italic font-medium text-ac">
              {reviewerName ?? (rating.description ? 'reviewed' : 'rated')}
            </em>
            {' · '}
            <time title={dateFormatted} dateTime={dateString}>
              {dateRelativeToNow}
            </time>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center bg-ac-soft p-6 sm:p-7">
        <img
          src={rating.book.coverUrl}
          alt={`Cover of ${rating.book.name}`}
          onClick={onOpenDetails}
          className="aspect-[2/3] w-28 cursor-pointer rounded-lg object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-[filter] hover:brightness-110 sm:w-32"
        />
      </div>
    </div>
  )
}
