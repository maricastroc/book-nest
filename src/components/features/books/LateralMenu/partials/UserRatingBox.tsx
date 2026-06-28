import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { StarsRating } from '@/components/features/books/StarsRating'
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'
import { RatingCardForm } from '../../RatingCardForm'
import { Avatar } from '@/components/shared/Avatar'
import { TextBox } from '@/components/features/books/TextBox'
import { useAppContext } from '@/contexts/AppContext'
import { BookProps } from '@/@types/book'
import { DropdownActions } from '@/components/features/books/DropdownActions'
import { useScreenSize } from '@/hooks/useScreenSize'
import { useClickOutside } from '@/hooks/useClickOutside'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { ArchivedWarning } from '@/components/features/books/ArchivedWarning'
import { useBookContext } from '@/contexts/BookContext'
import { RatingVoteSection } from '@/components/features/books/RatingVoteSection'
import { useRatings } from '@/contexts/RatingsContext'

interface UserRatingBoxProps {
  rating: RatingProps
  book: BookProps
}

export function UserRatingBox({ rating, book }: UserRatingBoxProps) {
  const router = useRouter()
  const { getRating } = useRatings()
  const currentRating = getRating(rating.id) || rating
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const [openEditReviewBox, setOpenEditReviewBox] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { isValidatingReview } = useAppContext()
  const { status, userRating } = useBookContext()
  const session = useSession()
  const isFromLoggedUser = rating.userId === session.data?.user.id
  const isMobile = useScreenSize(420)

  useClickOutside([dropdownRef, buttonRef], () => {
    if (!isDeleteModalOpen) setIsDropdownOpen(false)
  })

  if (isValidatingReview || userRating.isValidating)
    return <SkeletonRatingCard />

  if (openEditReviewBox) {
    return (
      <RatingCardForm
        isEdit
        rating={currentRating}
        book={book}
        onClose={() => setOpenEditReviewBox(false)}
      />
    )
  }

  return (
    <div className="flex w-full flex-col items-start rounded-[10px] border border-line bg-s2 px-5 py-4 gap-2.5">
      {/* Header */}
      <div className="flex w-full items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar
            isClickable
            variant="regular"
            avatarUrl={currentRating.user?.avatarUrl}
            onClick={() => router.push(`/profile/${currentRating.userId}`)}
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-[0.875rem] font-medium text-fg">
              {currentRating.user?.name ?? rating.user?.name}
            </p>
            <time
              title={dateFormatted}
              dateTime={dateString}
              className="text-[0.78rem] text-fg3"
            >
              {dateRelativeToNow}
            </time>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isMobile && (
            <StarsRating rating={currentRating.rate} size="smaller" />
          )}
          {isFromLoggedUser && (
            <DropdownActions
              variant="secondary"
              ratingId={currentRating.id}
              dropdownRef={dropdownRef}
              buttonRef={buttonRef}
              onToggleEditSection={(value) => setOpenEditReviewBox(value)}
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

      {isMobile && (
        <div className="-mt-1 mb-1">
          <StarsRating rating={currentRating.rate} size="smaller" />
        </div>
      )}

      <TextBox description={currentRating.description ?? ''} />

      {isFromLoggedUser && currentRating.deletedAt !== null && (
        <ArchivedWarning activeStatus={status.active || null} />
      )}

      <RatingVoteSection rating={currentRating} />
    </div>
  )
}
