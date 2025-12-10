import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import {
  UserRatingBoxHeader,
  UserNameDateWrapper,
  UserRatingBoxWrapper,
  UserRatingBoxContent,
  UserDetailsWrapper,
  UserRatingAndActionsWrapper,
  StarsRatingWrapper,
} from './styles'
import { StarsRating } from '@/components/shared/StarsRating'
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'

import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'
import { RatingCardForm } from '../../../RatingCardForm'
import { Avatar } from '@/components/shared/Avatar'
import { TextBox } from '@/components/shared/TextBox'
import { useAppContext } from '@/contexts/AppContext'
import { BookProps } from '@/@types/book'
import { DropdownActions } from '@/components/shared/DropdownActions.tsx'
import { useScreenSize } from '@/hooks/useScreenSize'
import { useClickOutside } from '@/hooks/useClickOutside'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { ArchivedWarning } from '@/components/shared/ArchivedWarning'
import { useBookContext } from '@/contexts/BookContext'
import { RatingVoteSection } from '@/components/shared/RatingVoteSection'
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
    if (!isDeleteModalOpen) {
      setIsDropdownOpen(false)
    }
  })

  return isValidatingReview || userRating.isValidating ? (
    <SkeletonRatingCard />
  ) : openEditReviewBox ? (
    <RatingCardForm
      isEdit
      rating={currentRating}
      book={book}
      onClose={() => setOpenEditReviewBox(false)}
    />
  ) : (
    <>
      <UserRatingBoxWrapper>
        <UserRatingBoxContent>
          <UserRatingBoxHeader>
            <UserDetailsWrapper>
              <Avatar
                isClickable
                variant="regular"
                avatarUrl={currentRating.user?.avatarUrl}
                onClick={() => {
                  router.push(`/profile/${currentRating.userId}`)
                }}
              />
              <UserNameDateWrapper>
                <p>{currentRating.user.name}</p>
                <time title={dateFormatted} dateTime={dateString}>
                  {dateRelativeToNow}
                </time>
              </UserNameDateWrapper>
            </UserDetailsWrapper>
            <UserRatingAndActionsWrapper>
              {!isMobile && <StarsRating rating={currentRating.rate} />}
              {isFromLoggedUser && (
                <DropdownActions
                  variant="secondary"
                  ratingId={currentRating.id}
                  dropdownRef={dropdownRef}
                  buttonRef={buttonRef}
                  onToggleEditSection={(value) => setOpenEditReviewBox(value)}
                  isDropdownOpen={isDropdownOpen}
                  onToggleDropdown={(value: boolean) =>
                    setIsDropdownOpen(value)
                  }
                  isDeleteSectionOpen={isDeleteModalOpen}
                  onToggleDeleteSection={(value: boolean) =>
                    setIsDeleteModalOpen(value)
                  }
                />
              )}
            </UserRatingAndActionsWrapper>
          </UserRatingBoxHeader>
          {isMobile && (
            <StarsRatingWrapper>
              <StarsRating rating={currentRating.rate} />
            </StarsRatingWrapper>
          )}
          {openEditReviewBox ? (
            <RatingCardForm
              book={book}
              onClose={() => setOpenEditReviewBox(false)}
            />
          ) : (
            <TextBox description={currentRating.description ?? ''} />
          )}
          {isFromLoggedUser && currentRating.deletedAt !== null && (
            <ArchivedWarning activeStatus={status.active || null} />
          )}

          <RatingVoteSection rating={currentRating} />
        </UserRatingBoxContent>
      </UserRatingBoxWrapper>
    </>
  )
}
