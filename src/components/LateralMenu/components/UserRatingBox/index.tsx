import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import {
  RatingTextContainer,
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
import { toast } from 'react-toastify'
import { api } from '@/lib/axios'
import { useState } from 'react'

import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { RatingCardForm } from '../RatingCardForm'
import { Avatar } from '@/components/Avatar'
import { useAppContext } from '@/contexts/AppContext'
import { UserActions } from '@/styles/shared'

interface UserRatingBoxProps {
  rating: RatingProps
  onCloseUserRatingBox: () => void
}

export function UserRatingBox({
  rating,
  onCloseUserRatingBox,
}: UserRatingBoxProps) {
  const router = useRouter()

  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const [openEditReviewBox, setOpenEditReviewBox] = useState(false)

  const {
    refreshBooks,
    refreshPopularBooks,
    refreshLatestRatings,
    refreshUserLatestRatings,
  } = useAppContext()

  const session = useSession()

  async function handleDeleteReview(id: string) {
    try {
      const payload = {
        id,
      }

      await api.delete('/ratings', { data: payload })

      toast.success('Rating successfully deleted!')

      await Promise.all([
        refreshBooks(),
        refreshLatestRatings(),
        refreshUserLatestRatings(),
        refreshPopularBooks(),
      ])

      onCloseUserRatingBox()
    } catch (error) {
      handleAxiosError(error)
    }
  }

  return openEditReviewBox ? (
    <RatingCardForm
      isEdit
      rating={rating}
      avatarUrl={rating.user.avatarUrl ?? ''}
      bookId={rating.bookId}
      name={rating.user.name}
      userId={rating.user.id}
      onClose={onCloseUserRatingBox}
      onCloseLateralMenu={onCloseUserRatingBox}
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
            avatarUrl={rating.user.avatarUrl ?? ''}
            bookId={rating.bookId}
            name={rating.user.name}
            userId={rating.user.id}
            onClose={onCloseUserRatingBox}
            onCloseLateralMenu={onCloseUserRatingBox}
          />
        ) : (
          <RatingTextContainer>
            <p>{rating.description}</p>
          </RatingTextContainer>
        )}
      </UserRatingBoxContent>
      {rating.userId === session.data?.user.id && (
        <>
          <UserActions>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Trash className="delete_icon" />
              </Dialog.Trigger>
              <DeleteModal onConfirm={() => handleDeleteReview(rating.id)} />
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
