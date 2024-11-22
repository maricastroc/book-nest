import { Check, Star, X } from 'phosphor-react'
import {
  ActionButton,
  CharacterCounter,
  CharacterCounterWrapper,
  RatingCardFormWrapper,
  FooterWrapper,
  UserActionsWrapper,
  ReviewForm,
  ReviewFormWrapper,
  RatingCardFormHeader,
  UserDetailsWrapper,
} from './styles'

import { Rating } from 'react-simple-star-rating'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import 'react-toastify/dist/ReactToastify.css'
import { AVATAR_URL_DEFAULT, REVIEW_MAX_LENGTH } from '@/utils/constants'
import { FormErrors } from '@/components/shared/FormErrors'
import { RatingProps } from '@/@types/rating'
import { Avatar } from '@/components/shared/Avatar'
import { useAppContext } from '@/contexts/AppContext'
import { useSession } from 'next-auth/react'
import { BookProps } from '@/@types/book'

interface RatingCardFormProps {
  isProfileScreen?: boolean
  isEdit?: boolean
  rating?: RatingProps | null
  book: BookProps
  onClose: () => void
  onUpdateReview: (updatedReview: RatingProps) => Promise<void>
  onCreateReview: (newRating: RatingProps) => void
}

const ratingCardFormSchema = z.object({
  description: z.string().nullable(),
  rate: z
    .number()
    .positive({ message: 'Please choose a rating from 1 to 5.' })
    .max(5),
})

type RatingCardFormData = z.infer<typeof ratingCardFormSchema>

export function RatingCardForm({
  book,
  onClose,
  isProfileScreen = false,
  isEdit = false,
  rating = null,
  onUpdateReview,
  onCreateReview,
  ...rest
}: RatingCardFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<RatingCardFormData>({
    resolver: zodResolver(ratingCardFormSchema),
    defaultValues: {
      description: isEdit ? rating?.description : '',
      rate: isEdit ? rating?.rate : 0,
    },
  })

  const session = useSession()

  const { loggedUser, handleCreateReview, handleEditReview } = useAppContext()

  const handleRating = (rate: number) => {
    setValue('rate', rate)
  }

  const characterCount = watch('description')?.split('').length || 0

  async function submitReview() {
    if (session.data?.user && handleCreateReview) {
      const data = watch()

      const payload = {
        rate: data.rate,
        description: data?.description || '',
        userId: session.data.user.id.toString(),
        bookId: book.id.toString(),
        status: book.readingStatus,
      }

      const createdRating = await handleCreateReview(payload)
      onCreateReview(createdRating)
      onClose()
    }
  }

  async function editReview() {
    if (rating && handleEditReview) {
      const data = watch()

      const payload = {
        rate: data.rate,
        description: data?.description || '',
        ratingId: rating.id,
      }

      const updatedRating = await handleEditReview(payload)
      await onUpdateReview(updatedRating)
      onClose()
    }
  }

  return (
    loggedUser && (
      <RatingCardFormWrapper
        onSubmit={handleSubmit(isEdit ? editReview : submitReview)}
        {...rest}
      >
        <RatingCardFormHeader className={isProfileScreen ? 'profile' : ''}>
          <UserDetailsWrapper>
            <Avatar
              isClickable={false}
              avatarUrl={loggedUser.avatarUrl ?? AVATAR_URL_DEFAULT}
              variant="medium"
            />
            <p>{loggedUser.name}</p>
          </UserDetailsWrapper>
          <Rating
            initialValue={rating?.rate}
            onClick={handleRating}
            emptyIcon={<Star size={20} />}
            fillIcon={<Star weight="fill" size={20} />}
            emptyColor="#8381D9"
            fillColor="#8381D9"
            {...register('rate')}
          />
        </RatingCardFormHeader>
        <ReviewFormWrapper>
          <ReviewForm
            placeholder="Write your review here"
            maxLength={REVIEW_MAX_LENGTH}
            spellCheck={false}
            {...register('description')}
          />
        </ReviewFormWrapper>
        <FooterWrapper>
          <CharacterCounterWrapper>
            <CharacterCounter>
              <span>{characterCount}</span>/{REVIEW_MAX_LENGTH}
            </CharacterCounter>
            {(errors.rate || errors.description) && (
              <>
                <FormErrors error={errors?.rate?.message} />
                <FormErrors error={errors?.description?.message} />
              </>
            )}
          </CharacterCounterWrapper>
          <UserActionsWrapper>
            <ActionButton
              type="button"
              disabled={isSubmitting}
              onClick={() => onClose()}
            >
              <X color="#8381D9" />
            </ActionButton>
            <ActionButton type="submit" disabled={isSubmitting}>
              <Check color="#50B2C0" />
            </ActionButton>
          </UserActionsWrapper>
        </FooterWrapper>
      </RatingCardFormWrapper>
    )
  )
}
