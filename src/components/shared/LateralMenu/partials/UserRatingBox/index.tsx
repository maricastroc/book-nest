import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import {
  UserRatingBoxHeader,
  UserNameDateWrapper,
  UserRatingBoxWrapper,
  UserRatingBoxContent,
  UserDetailsWrapper,
} from './styles'
import { StarsRating } from '@/components/shared/StarsRating'
import { useSession } from 'next-auth/react'
import { Trash, Pencil } from 'phosphor-react'
import { DeleteModal } from '../../../../modals/DeleteModal'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'

import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { RatingCardForm } from '../../../RatingCardForm'
import { Avatar } from '@/components/shared/Avatar'
import { UserActions } from '@/styles/shared'
import { TextBox } from '@/components/shared/TextBox'
import { useAppContext } from '@/contexts/AppContext'
import { BookProps } from '@/@types/book'

interface UserRatingBoxProps {
  rating: RatingProps
  book: BookProps
  onUpdateReview: (updatedReview: RatingProps) => Promise<void>
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

  const { handleDeleteReview } = useAppContext()

  const session = useSession()

  const isFromLoggedUser = rating.userId === session.data?.user.id

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
            book={book}
            onClose={() => setOpenEditReviewBox(false)}
            onUpdateReview={onUpdateReview}
            onCreateReview={onCreateReview}
          />
        ) : (
          <TextBox description={rating.description ?? ''} />
        )}
      </UserRatingBoxContent>
      {isFromLoggedUser && (
        <>
          <UserActions>
            <Dialog.Root open={isDeleteModalOpen}>
              <Dialog.Trigger asChild>
                <Trash
                  className="delete_icon"
                  onClick={() => setIsDeleteModalOpen(true)}
                />
              </Dialog.Trigger>
              <DeleteModal
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                  handleDeleteReview(rating.id)
                  onDeleteReview(rating.id)
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
