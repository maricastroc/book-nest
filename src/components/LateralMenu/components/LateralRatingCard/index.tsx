import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import {
  BookDescription,
  DeleteAndEdit,
  Header,
  NameAndDate,
  RatingContainer,
  RatingContent,
  UserData,
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

interface LateralRatingCardProps {
  rating: RatingProps
  onCloseLateralMenu: () => void
}

export function LateralRatingCard({
  rating,
  onCloseLateralMenu,
}: LateralRatingCardProps) {
  const router = useRouter()

  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const [openEditReviewBox, setOpenEditReviewBox] = useState(false)

  const session = useSession()

  async function handleDeleteReview(id: string) {
    try {
      const payload = {
        id,
      }
      await api.delete('/ratings', { data: payload })
    } catch (error) {
      handleAxiosError(error)
    }
    onCloseLateralMenu()
    toast.success('Rating successfully deleted!')
  }

  return openEditReviewBox ? (
    <RatingCardForm
      isEdit
      rating={rating}
      avatarUrl={rating.user.avatarUrl ?? ''}
      bookId={rating.bookId}
      name={rating.user.name}
      userId={rating.user.id}
      onClose={onCloseLateralMenu}
      onCloseLateralMenu={onCloseLateralMenu}
    />
  ) : (
    <RatingContainer>
      <RatingContent>
        <Header>
          <UserData>
            <Avatar
              isClickable
              variant="regular"
              avatarUrl={rating.user?.avatarUrl ?? AVATAR_URL_DEFAULT}
              onClick={() => {
                router.push(`/profile/${rating.userId}`)
              }}
            />
            <NameAndDate>
              <p>{rating.user.name}</p>
              <time title={dateFormatted} dateTime={dateString}>
                {dateRelativeToNow}
              </time>
            </NameAndDate>
          </UserData>
          <StarsRating rating={rating.rate} />
        </Header>
        {openEditReviewBox ? (
          <RatingCardForm
            avatarUrl={rating.user.avatarUrl ?? ''}
            bookId={rating.bookId}
            name={rating.user.name}
            userId={rating.user.id}
            onClose={onCloseLateralMenu}
            onCloseLateralMenu={onCloseLateralMenu}
          />
        ) : (
          <BookDescription>
            <p>{rating.description}</p>
          </BookDescription>
        )}
      </RatingContent>
      {rating.userId === session.data?.user.id && (
        <>
          <DeleteAndEdit>
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
          </DeleteAndEdit>
        </>
      )}
    </RatingContainer>
  )
}
