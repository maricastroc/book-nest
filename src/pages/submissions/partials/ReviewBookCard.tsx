/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/router'

import { BookProps } from '@/@types/book'
import { Avatar } from '@/components/ui/Avatar'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'

interface Props {
  book: BookProps
  onClose?: () => void
  onUpdateBook: (book: BookProps) => void
  mutate: any
}

export function ReviewBookCard({ book }: Props) {
  const router = useRouter()

  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(book.createdAt)

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-s1 p-4 transition-colors hover:border-line-strong">
      <div className="flex items-stretch gap-3">
        <img
          src={book.coverUrl}
          alt={book.name}
          className="h-30 w-[5.2rem] rounded-lg object-cover shadow-[0_15px_30px_rgba(0,0,0,0.4),0_6px_12px_rgba(0,0,0,0.2)]"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h2 className="line-clamp-2 text-[0.9rem] font-semibold leading-snug text-fg">
              {book.name}
            </h2>
            <p className="mt-1 line-clamp-2 text-[0.85rem] text-fg2">
              {book.author}
            </p>
          </div>
          <time
            title={dateFormatted}
            dateTime={dateString}
            className="text-[0.75rem] text-fg3"
          >
            {dateRelativeToNow}
          </time>
        </div>
      </div>

      <span className="h-px w-full bg-line" />

      <div className="flex items-center gap-2.5">
        <Avatar variant="small" avatarUrl={book?.user?.avatarUrl} />
        <div className="flex flex-col text-[0.82rem]">
          <p className="text-fg2">Submitted by:</p>
          <strong className="font-semibold text-fg">{book?.user?.name}</strong>
        </div>
      </div>

      <span className="h-px w-full bg-line" />

      <button
        onClick={() => router.push(`/submissions/${book.id}`)}
        className="mt-1 w-full rounded-[10px] bg-ac py-2 text-[13px] font-bold text-ac-ink transition-opacity hover:opacity-90"
      >
        Review
      </button>
    </div>
  )
}
