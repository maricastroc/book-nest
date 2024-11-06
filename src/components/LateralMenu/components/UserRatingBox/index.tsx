import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import {
  UserRatingBoxHeader,
  UserNameDateWrapper,
  UserRatingBoxWrapper,
  UserRatingBoxContent,
  UserDetailsWrapper,
} from './styles'
import { StarsRating } from '@/components/StarsRating'
import { useSession } from 'next-auth/react'
import { Trash, Pencil } from 'phosphor-react'
import { DeleteModal } from '../DeleteModal'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'

import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { RatingCardForm } from '../RatingCardForm'
import { Avatar } from '@/components/Avatar'
import { UserActions } from '@/styles/shared'
import { CreateReviewData, EditReviewData } from '@/pages/home/index.page'
import { TextBox } from '@/components/shared/TextBox'

interface UserRatingBoxProps {
  rating: RatingProps
  onCloseUserRatingBox: () => void
  handleDeleteReview: (value: string) => void
  handleEditReview: (data: EditReviewData) => void
  handleCreateReview: (data: CreateReviewData) => void
}

export function UserRatingBox({
  rating,
  onCloseUserRatingBox,
  handleDeleteReview,
  handleEditReview,
  handleCreateReview,
}: UserRatingBoxProps) {
  const router = useRouter()

  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const [openEditReviewBox, setOpenEditReviewBox] = useState(false)

  const session = useSession()

  return openEditReviewBox ? (
    <RatingCardForm
      isEdit
      rating={rating}
      bookId={rating.bookId}
      onClose={onCloseUserRatingBox}
      handleEditReview={handleEditReview}
      handleCreateReview={handleCreateReview}
    />
  ) : (
    <UserRatingBoxWrapper>
      <UserRatingBoxContent>
        <UserRatingBoxHeader>
          <UserDetailsWrapper>
            <Avatar
              isClickable
              variant="regular"
              avatarUrl={rating.user?.avatarUrl ?? AVATAR_URL_DEFAULT}
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
          <StarsRating rating={rating.rate} />
        </UserRatingBoxHeader>
        {openEditReviewBox ? (
          <RatingCardForm
            bookId={rating.bookId}
            onClose={onCloseUserRatingBox}
            handleEditReview={handleEditReview}
            handleCreateReview={handleCreateReview}
          />
        ) : (
          <TextBox description={rating.description} />
        )}
      </UserRatingBoxContent>
      {rating.userId === session.data?.user.id && (
        <>
          <UserActions>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Trash className="delete_icon" />
              </Dialog.Trigger>
              <DeleteModal
                onConfirm={() => {
                  handleDeleteReview(rating.id)
                  onCloseUserRatingBox()
                }}
              />
            </Dialog.Root>
            <Pencil
              className="edit_icon"
              onClick={() => setOpenEditReviewBox(!openEditReviewBox)}
            />
          </UserActions>
        </>
      )}
    </UserRatingBoxWrapper>
  )
}
