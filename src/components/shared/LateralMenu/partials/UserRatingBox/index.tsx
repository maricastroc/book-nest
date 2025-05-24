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
import { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'
import { RatingCardForm } from '../../../RatingCardForm'
import { Avatar } from '@/components/shared/Avatar'
import { TextBox } from '@/components/shared/TextBox'
import { useAppContext } from '@/contexts/AppContext'
import { BookProps } from '@/@types/book'
import { DropdownActions } from '@/components/shared/DropdownActions.tsx'
import { useScreenSize } from '@/hooks/useScreenSize'

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

  const { handleDeleteReview } = useAppContext()

  const session = useSession()

  const isFromLoggedUser = rating.userId === session.data?.user.id

  const isMobile = useScreenSize(420)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !isDeleteModalOpen
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDeleteModalOpen])

  return openEditReviewBox ? (
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
                dropdownRef={dropdownRef}
                buttonRef={buttonRef}
                handleIsEditUserReviewCardOpen={(value) =>
                  setOpenEditReviewBox(value)
                }
                isDropdownOpen={isDropdownOpen}
                handleSetIsDropdownOpen={(value: boolean) =>
                  setIsDropdownOpen(value)
                }
                isDeleteModalOpen={isDeleteModalOpen}
                handleSetIsDeleteModalOpen={(value: boolean) =>
                  setIsDeleteModalOpen(value)
                }
                handleDeleteReview={() => {
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
