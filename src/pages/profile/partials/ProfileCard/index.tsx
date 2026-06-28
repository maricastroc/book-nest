import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useAppContext } from '@/contexts/AppContext'
import { RatingProps } from '@/@types/rating'
import { BookProps } from '@/@types/book'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useScreenSize } from '@/hooks/useScreenSize'

import { StarsRating } from '@/components/features/books/StarsRating'
import { TextBox } from '@/components/features/books/TextBox'
import { RatingCardForm } from '@/components/features/books/RatingCardForm'
import { DropdownActions } from '@/components/features/books/DropdownActions'
import { ArchivedWarning } from '@/components/features/books/ArchivedWarning'
import { useBookContext } from '@/contexts/BookContext'
import { RatingVoteSection } from '@/components/features/books/RatingVoteSection'

interface ProfileCardProps {
  book: BookProps
  rating: RatingProps
  userId: string | undefined
  onSelect: () => void
}

export function ProfileCard({
  book,
  rating,
  userId,
  onSelect,
}: ProfileCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const [isEditUserReviewCardOpen, setIsEditUserReviewCardOpen] =
    useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { loggedUser } = useAppContext()

  const dropdownRef = useRef<HTMLDivElement>(null)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const isMobile = useScreenSize(480)

  const isFromLoggedUser = userId === loggedUser?.id

  const isEditDisabled = !['read', 'didNotFinish'].includes(
    book.readingStatus || '',
  )

  const belongsToLoggedUser = rating.userId === loggedUser?.id

  const { status } = useBookContext()

  useClickOutside([dropdownRef, buttonRef], () => {
    if (!isDeleteModalOpen) {
      setIsDropdownOpen(false)
    }
  })

  return isEditUserReviewCardOpen ? (
    <RatingCardForm
      isEdit
      rating={rating}
      book={book}
      onClose={() => setIsEditUserReviewCardOpen(false)}
    />
  ) : (
    <div className="bn-scope w-full rounded-xl border border-line bg-s1 p-4 transition-colors hover:border-line-strong sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11.5px] text-fg3">
            <time title={dateFormatted} dateTime={dateString}>
              {dateRelativeToNow}
            </time>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isMobile && <StarsRating rating={rating.rate} size="smaller" />}
          {belongsToLoggedUser && (
            <DropdownActions
              ratingId={rating.id}
              dropdownRef={dropdownRef}
              buttonRef={buttonRef}
              onToggleEditSection={(value) =>
                setIsEditUserReviewCardOpen(value)
              }
              isDropdownOpen={isDropdownOpen}
              onToggleDropdown={(value: boolean) => setIsDropdownOpen(value)}
              isDeleteSectionOpen={isDeleteModalOpen}
              onToggleDeleteSection={(value: boolean) =>
                setIsDeleteModalOpen(value)
              }
            />
          )}
        </div>
      </div>

      {book && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.name}`}
              onClick={onSelect}
              className="w-22 shrink-0 cursor-pointer rounded-lg shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-[filter] hover:brightness-110 sm:w-24"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div>
                <h2 className="line-clamp-3 text-[14px] font-semibold leading-snug text-fg">
                  {book.name}
                </h2>
                <p className="mt-0.5 text-[12.5px] text-fg3">{book.author}</p>
              </div>
              {isMobile ? (
                <StarsRating rating={rating.rate} size="smaller" />
              ) : rating.description !== '' ? (
                <TextBox description={rating.description} />
              ) : loggedUser?.id === rating.userId && !isEditDisabled ? (
                <button
                  onClick={() => setIsEditUserReviewCardOpen(true)}
                  className="flex min-h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-fg3 bg-transparent text-[0.9rem] text-fg3 transition-colors hover:border-fg2 hover:text-fg2"
                >
                  Add your Review{' '}
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: 14 }} />
                </button>
              ) : (
                <p className="text-[0.85rem] text-fg3">
                  No description available.
                </p>
              )}
            </div>
          </div>

          {isMobile && (
            <>
              <div className="h-px w-full bg-line" />
              {rating.description !== '' ? (
                <TextBox description={rating.description} />
              ) : loggedUser?.id === rating.userId ? (
                <button
                  onClick={() => setIsEditUserReviewCardOpen(true)}
                  className="flex min-h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-fg3 bg-transparent text-[0.9rem] text-fg3 transition-colors hover:border-fg2 hover:text-fg2"
                >
                  Add your Review{' '}
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: 14 }} />
                </button>
              ) : null}
              <div className="flex items-center">
                <RatingVoteSection rating={rating} />
              </div>
            </>
          )}

          {!isMobile && <RatingVoteSection rating={rating} />}

          {isFromLoggedUser && (
            <ArchivedWarning
              style={{ marginTop: '0.25rem' }}
              activeStatus={status.active || null}
            />
          )}
        </div>
      )}
    </div>
  )
}
