import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faPlus } from '@fortawesome/free-solid-svg-icons'
import { StarsRating } from '@/components/features/books/StarsRating'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { ReadingStatus } from '@/@types/reading-status'
import { useEffect, useRef, useState } from 'react'
import { TextBox } from '@/components/features/books/TextBox'
import { useClickOutside } from '@/hooks/useClickOutside'
import { DropdownMenu } from './partials/DropdownMenu'
import { BookStats } from './partials/BookStats'
import { SignInModal } from '@/components/features/auth/SignInModal'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppContext } from '@/contexts/AppContext'
import { getReadingStatusLabel } from '@/utils/getReadingStatusLabel'
import { Avatar } from '@/components/shared/Avatar'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useRouter } from 'next/router'

const statusBarColor: Record<string, string> = {
  read: '#4a9e6e',
  reading: '#ca4036',
  wantToRead: '#c64a96',
  didNotFinish: '#cc803d',
}

interface MenuBookCardProps {
  book: BookProps
  categories: CategoryProps[]
  setIsValidatingStatus: (value: boolean) => void
  onUpdateStatus: (newStatus: string | null) => void
}

export function MenuBookCard({
  onUpdateStatus,
  setIsValidatingStatus,
  book,
  categories,
}: MenuBookCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(book.createdAt)

  const [updatedBook, setUpdatedBook] = useState(book)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isAddToLibraryDropdownOpen, setIsAddToLibraryDropdownOpen] =
    useState(false)
  const [isRatingBookModalOpen, setIsRatingBookModalOpen] = useState(false)

  const { loggedUser } = useAppContext()
  const router = useRouter()
  const categoryNames = categories.map((c) => c?.name)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useClickOutside([dropdownRef], () => setIsAddToLibraryDropdownOpen(false))

  useEffect(() => {
    if (book) setUpdatedBook(book)
  }, [book])

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border border-line bg-s2 p-6 sm:px-8">
      <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row sm:items-stretch sm:justify-between sm:gap-8">
        <img
          alt={`Cover of ${updatedBook.name}`}
          src={updatedBook.coverUrl}
          className="w-30 shrink-0 rounded-md object-contain shadow-[0_16px_36px_rgba(0,0,0,0.55),0_6px_12px_rgba(0,0,0,0.3)] sm:w-35"
        />

        <div className="flex h-full w-full flex-col items-center justify-between gap-5 sm:items-start">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h2 className="max-h-18 overflow-hidden whitespace-pre-wrap text-[1.1rem] font-bold leading-snug text-fg sm:max-h-none sm:text-[1.35rem]">
              {updatedBook.name}
            </h2>
            <p className="mt-1 text-[0.9rem] text-fg2 sm:text-[1rem]">
              {updatedBook.author}
            </p>
          </div>

          {/* Rating + library button */}
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <StarsRating rating={updatedBook?.rate ?? 0} />
              <span className="text-[0.9rem] font-bold text-fg">
                {updatedBook?.rate?.toFixed(2) ?? '0.00'}
              </span>
              <span className="text-[0.82rem] text-fg3">
                (
                {(updatedBook?.ratings?.length ?? 0) +
                  (updatedBook?.userRating ? 1 : 0)}{' '}
                {updatedBook?.ratings?.length === 1 ? 'rating' : 'ratings'})
              </span>
            </div>

            {/* Add to Library */}
            <div className="relative flex w-full flex-col gap-2">
              <Dialog.Root open={isSignInModalOpen}>
                <Dialog.Trigger asChild>
                  <button
                    onClick={() =>
                      !loggedUser
                        ? setIsSignInModalOpen(true)
                        : setIsAddToLibraryDropdownOpen(true)
                    }
                    className="relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-lg border border-line bg-white/4 px-4 py-2 text-[0.875rem] font-medium text-fg transition-colors hover:bg-white/[0.07]"
                  >
                    {updatedBook?.readingStatus ? (
                      <>
                        <span
                          className="absolute inset-y-0 left-0 w-0.75"
                          style={{
                            background:
                              statusBarColor[updatedBook.readingStatus],
                          }}
                        />
                        {getReadingStatusLabel(updatedBook.readingStatus)}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faBookmark}
                          className="text-ac"
                          style={{ fontSize: 15 }}
                        />
                        <span className="flex-1 text-center text-ac">
                          Add to Library
                        </span>
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-ac"
                          style={{ fontSize: 14 }}
                        />
                      </>
                    )}
                  </button>
                </Dialog.Trigger>
                <SignInModal
                  context="library"
                  onClose={() => setIsSignInModalOpen(false)}
                />
              </Dialog.Root>

              <Dialog.Root
                open={isRatingBookModalOpen}
                onOpenChange={setIsRatingBookModalOpen}
              >
                <Dialog.Trigger asChild>
                  <DropdownMenu
                    isOpen={isAddToLibraryDropdownOpen}
                    setIsValidatingStatus={setIsValidatingStatus}
                    activeStatus={
                      (book?.readingStatus as ReadingStatus) ?? null
                    }
                    onClose={() => setIsAddToLibraryDropdownOpen(false)}
                    dropdownRef={dropdownRef}
                    book={book}
                    onUpdateStatus={onUpdateStatus}
                  />
                </Dialog.Trigger>
              </Dialog.Root>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <span className="my-4 block h-px w-full bg-white/6" />

      <TextBox description={book.summary} />

      <span className="my-4 block h-px w-full bg-white/6" />

      <BookStats
        categoryNames={categoryNames}
        totalPages={book.totalPages}
        publishingYear={book.publishingYear ?? '-'}
        publisher={book.publisher || ''}
        language={book.language || ''}
        isbn={book.isbn || ''}
      />

      {book.user?.id && (
        <>
          <span className="my-4 block h-px w-full bg-white/6" />
          <div className="flex w-full items-center gap-3">
            <Avatar
              isClickable
              variant="small"
              avatarUrl={book.user?.avatarUrl}
              onClick={() => router.push(`/profile/${book.user?.id}`)}
            />
            <div className="flex flex-col text-[0.78rem] text-fg3">
              <p className="text-[0.82rem] text-fg2">
                Submitted by:{' '}
                <strong className="font-semibold text-fg">
                  {book.user?.name}
                </strong>
              </p>
              <time
                title={dateFormatted}
                dateTime={dateString}
                className="text-[0.72rem] text-fg3"
              >
                {dateRelativeToNow}
              </time>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
