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
import { REVIEW_MAX_LENGTH } from '@/utils/constants'
import { FormErrors } from '@/components/shared/FormErrors'
import { RatingProps } from '@/@types/rating'
import { Avatar } from '@/components/Avatar'
import { CreateReviewData, EditReviewData } from '@/pages/home/index.page'

interface RatingCardFormProps {
  isEdit?: boolean
  rating?: RatingProps | null
  avatarUrl: string
  name: string
  bookId: string
  userId: string | number | undefined
  onClose: () => void
  handleEditReview: (data: EditReviewData) => void
  handleCreateReview: (data: CreateReviewData) => void
}

const ratingCardFormSchema = z.object({
  description: z
    .string()
    .min(3, { message: 'Please, write your review before submit.' }),
  rate: z
    .number()
    .positive({ message: 'Please choose a rating from 1 to 5.' })
    .max(5),
})

type RatingCardFormData = z.infer<typeof ratingCardFormSchema>

export function RatingCardForm({
  avatarUrl,
  name,
  bookId,
  userId,
  onClose,
  handleEditReview,
  handleCreateReview,
  isEdit = false,
  rating = null,
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

  const handleRating = (rate: number) => {
    setValue('rate', rate)
  }

  const characterCount = watch('description')?.split('').length || 0

  async function submitReview() {
    if (userId) {
      const data = watch()

      const payload = {
        rate: data.rate,
        description: data.description,
        userId: userId.toString(),
        bookId: bookId.toString(),
      }

      handleCreateReview(payload)

      onClose()
    }
  }

  async function editReview() {
    if (rating) {
      const data = watch()

      const payload = {
        rate: data.rate,
        description: data.description,
        ratingId: rating.id,
      }

      handleEditReview(payload)

      onClose()
    }
  }

  return (
    <RatingCardFormWrapper
      onSubmit={handleSubmit(isEdit ? editReview : submitReview)}
    >
      <RatingCardFormHeader>
        <UserDetailsWrapper>
          <Avatar isClickable={false} avatarUrl={avatarUrl} variant="medium" />
          <p>{name}</p>
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
}
