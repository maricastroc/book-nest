import { Avatar } from '@/components/ui/Avatar'
import { StarsRating } from '@/components/features/books/StarsRating'
import { TextBox } from '@/components/features/books/TextBox'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useRouter } from 'next/router'
import { useScreenSize } from '@/hooks/useScreenSize'
import { RatingProps } from '@/@types/rating'

interface RatingCardProps {
  rating: RatingProps
  onOpenDetails: () => void
  updatedLatestRatings?: RatingProps[]
}

export function RatingCard({ rating, onOpenDetails }: RatingCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const router = useRouter()
  const isMobile = useScreenSize(480)

  return (
    <div className="bn-scope w-full rounded-xl border border-line bg-s1 p-4 transition-colors hover:border-line-strong sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            isClickable
            avatarUrl={rating.user?.avatarUrl}
            onClick={() => router.push(`/profile/${rating.user.id}`)}
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-[13.5px] font-medium text-fg">
              {rating.user.name}
            </p>
            <span className="text-[11.5px] text-fg3">
              <em className="not-italic font-medium text-ac">
                {rating.description ? 'reviewed' : 'rated'}
              </em>
              {' · '}
              <time title={dateFormatted} dateTime={dateString}>
                {dateRelativeToNow}
              </time>
            </span>
          </div>
        </div>
        {!isMobile && <StarsRating rating={rating.rate} size="smaller" />}
      </div>

      {rating?.book && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <img
              src={rating.book.coverUrl}
              alt={`Cover of ${rating.book.name}`}
              onClick={onOpenDetails}
              className="w-22 shrink-0 cursor-pointer rounded-lg shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-[filter] hover:brightness-110 sm:w-24"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div>
                <h2 className="line-clamp-3 text-[14px] font-semibold leading-snug text-fg">
                  {rating.book.name}
                </h2>
                <p className="mt-0.5 text-[12.5px] text-fg3">
                  {rating.book.author}
                </p>
              </div>
              {isMobile ? (
                <StarsRating rating={rating.rate} size="smaller" />
              ) : (
                <TextBox description={rating.description} />
              )}
            </div>
          </div>

          {isMobile && (
            <>
              <div className="h-px w-full bg-line" />
              <TextBox description={rating.description} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
