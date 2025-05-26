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

interface UserRatingBoxProps {
  rating: RatingProps
  book: BookProps
  onUpdateReview: (updatedReview: RatingProps) => void
  onCreateReview: (newRating: RatingProps) => void
  onDeleteReview: (ratingId: string) => void
}

export function UserRatingBox({
  rating,
  book,
  onUpdateReview,
  onCreateReview,
  onDeleteReview,
}: UserRatingBoxProps) {
  const router = useRouter()

  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const [openEditReviewBox, setOpenEditReviewBox] = useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const { handleDeleteReview, isValidatingReview } = useAppContext()

  const session = useSession()

  const isFromLoggedUser = rating.userId === session.data?.user.id

  const isMobile = useScreenSize(420)

  useClickOutside([dropdownRef, buttonRef], () => {
    if (!isDeleteModalOpen) {
      setIsDropdownOpen(false)
    }
  })

  return isValidatingReview ? (
    <SkeletonRatingCard />
  ) : openEditReviewBox ? (
    <RatingCardForm
      isEdit
      rating={rating}
      book={book}
      onClose={() => setOpenEditReviewBox(false)}
      onUpdateReview={onUpdateReview}
      onCreateReview={onCreateReview}
    />
  ) : (
    <UserRatingBoxWrapper>
      <UserRatingBoxContent>
        <UserRatingBoxHeader>
          <UserDetailsWrapper>
            <Avatar
              isClickable
              variant="regular"
              avatarUrl={rating.user?.avatarUrl}
              onClick={() => {
                router.push(`/profile/${rating.userId}`)
              }}
            />
            <UserNameDateWrapper>
              <p>{rating.user.name}</p>
              <time title={dateFormatted} dateTime={dateString}>
                {dateRelativeToNow}
              </time>
            </UserNameDateWrapper>
          </UserDetailsWrapper>
          <UserRatingAndActionsWrapper>
            {!isMobile && <StarsRating rating={rating.rate} />}
            {isFromLoggedUser && (
              <DropdownActions
                variant="secondary"
                readingStatus={book?.readingStatus || undefined}
                dropdownRef={dropdownRef}
                buttonRef={buttonRef}
                onToggleEditSection={(value) => setOpenEditReviewBox(value)}
                isDropdownOpen={isDropdownOpen}
                onToggleDropdown={(value: boolean) => setIsDropdownOpen(value)}
                isDeleteSectionOpen={isDeleteModalOpen}
                onToggleDeleteSection={(value: boolean) =>
                  setIsDeleteModalOpen(value)
                }
                onDelete={() => {
                  onDeleteReview(rating.id)
                  handleDeleteReview(rating.id)
                }}
              />
            )}
          </UserRatingAndActionsWrapper>
        </UserRatingBoxHeader>
        {isMobile && (
          <StarsRatingWrapper>
            <StarsRating rating={rating.rate} />
          </StarsRatingWrapper>
        )}
        {openEditReviewBox ? (
          <RatingCardForm
            book={book}
            onClose={() => setOpenEditReviewBox(false)}
            onUpdateReview={onUpdateReview}
            onCreateReview={onCreateReview}
          />
        ) : (
          <TextBox description={rating.description ?? ''} />
        )}
      </UserRatingBoxContent>
    </UserRatingBoxWrapper>
  )
}
