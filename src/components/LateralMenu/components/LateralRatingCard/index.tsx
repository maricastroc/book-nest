import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import {
  ActionButton,
  AvatarContainer,
  AvatarDefault,
  BookDescription,
  ButtonsContainer,
  CharacterCounter,
  DeleteAndEdit,
  FormErrors,
  Header,
  NameAndDate,
  RatingContainer,
  RatingContent,
  ReviewForm,
  ReviewFormContainer,
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

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { RatingProps } from '@/@types/rating'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'

interface LateralRatingCardProps {
  rating: RatingProps
  onCloseLateralMenu: () => void
}

const editRatingCardFormSchema = z.object({
  description: z
    .string()
    .min(3, { message: 'Please, write your review before submit.' }),
})

type EditRatingCardFormData = z.infer<typeof editRatingCardFormSchema>

export function LateralRatingCard({
  rating,
  onCloseLateralMenu,
}: LateralRatingCardProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<EditRatingCardFormData>({
    resolver: zodResolver(editRatingCardFormSchema),
    defaultValues: {
      description: rating.description || '',
    },
  })

  const router = useRouter()

  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const [openEditReviewBox, setOpenEditReviewBox] = useState(false)

  const characterCount = watch('description')?.split('').length || 0

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

  async function handleEditRating(data: EditRatingCardFormData) {
    const description = String(data.description)

    try {
      const payload = {
        id: rating.id,
        description,
      }

      await api.put('/ratings', payload)

      onCloseLateralMenu()

      toast.success('Review successfully edited!')
    } catch (error) {
      handleAxiosError(error)
    }
  }

  return (
    <RatingContainer>
      <RatingContent
        className={rating.userId === session.data?.user.id ? 'from_user' : ''}
      >
        <Header>
          <UserData>
            <AvatarContainer
              onClick={() => {
                router.push(`/profile/${rating.userId}`)
              }}
            >
              <AvatarDefault
                alt=""
                src={rating.user?.avatarUrl ?? AVATAR_URL_DEFAULT}
              />
            </AvatarContainer>
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
          <ReviewFormContainer onSubmit={handleSubmit(handleEditRating)}>
            <ReviewForm
              placeholder="Write your review here"
              maxLength={450}
              spellCheck={false}
              {...register('description')}
            />
            {errors.description && (
              <FormErrors>
                <span>{errors.description.message}</span>
              </FormErrors>
            )}
            <CharacterCounter>
              <span>{characterCount}</span>/450
            </CharacterCounter>
            <ButtonsContainer>
              <ActionButton
                className="edit_btn"
                type="submit"
                disabled={isSubmitting}
              >
                Edit
              </ActionButton>
              <ActionButton
                className="cancel_btn"
                onClick={() => setOpenEditReviewBox(false)}
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </ActionButton>
            </ButtonsContainer>
          </ReviewFormContainer>
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
