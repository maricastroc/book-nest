/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

interface RatingCardProps {
  id: string
  avatarUrl: string | null
  name: string | null
  createdAt: Date | null
  description: string | null
  rating: number | null
  user: string | null
  userId: string | null
  onCloseLateralMenu: () => void
}

const editReviewCardFormSchema = z.object({
  description: z
    .string()
    .min(3, { message: 'Please, write your review before submit.' }),
})

type EditReviewCardFormData = z.infer<typeof editReviewCardFormSchema>

export function RatingCard({
  id,
  avatarUrl,
  name,
  rating,
  createdAt,
  description,
  user,
  userId,
  onCloseLateralMenu,
}: RatingCardProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<EditReviewCardFormData>({
    resolver: zodResolver(editReviewCardFormSchema),
    defaultValues: {
      description: description || '',
    },
  })

  const router = useRouter()

  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(createdAt!)

  const [openEditReviewBox, setOpenEditReviewBox] = useState(false)

  const characterCount = watch('description')?.split('').length || 0

  const session = useSession()

  async function handleDeleteReview(id: string) {
    try {
      const payload = {
        id,
      }
      await api.delete('/ratings', { data: payload })
    } catch (err) {
      console.log(err)
    }
    onCloseLateralMenu()
    toast.success('Review successfully deleted!')
  }

  async function handleEditReview(data: EditReviewCardFormData) {
    const description = String(data.description)
    try {
      const payload = {
        id,
        description,
      }
      await api.put('/ratings', payload)
    } catch (err) {
      console.log(err)
    }
    onCloseLateralMenu()
    toast.success('Review successfully edited!')
  }

  return (
    <RatingContainer>
      <RatingContent
        className={user === session.data?.user.id ? 'from_user' : ''}
      >
        <Header>
          <UserData>
            <AvatarContainer
              onClick={() => {
                router.push(`/profile/${userId}`)
              }}
            >
              <AvatarDefault alt="" src={avatarUrl!} />
            </AvatarContainer>
            <NameAndDate>
              <p>{name}</p>
              <time title={dateFormatted} dateTime={dateString}>
                {dateRelativeToNow}
              </time>
            </NameAndDate>
          </UserData>
          <StarsRating rating={rating!} />
        </Header>
        {openEditReviewBox ? (
          <ReviewFormContainer onSubmit={handleSubmit(handleEditReview)}>
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
            <p>{description}</p>
          </BookDescription>
        )}
      </RatingContent>
      {user === session.data?.user.id && (
        <>
          <DeleteAndEdit>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Trash className="delete_icon" />
              </Dialog.Trigger>
              <DeleteModal onConfirm={() => handleDeleteReview(id)} />
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
