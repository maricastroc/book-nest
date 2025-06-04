import { Check, Star, X } from 'phosphor-react'
import {
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

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import 'react-toastify/dist/ReactToastify.css'
import { REVIEW_MAX_LENGTH, REVIEW_MIN_LENGTH } from '@/utils/constants'
import { RatingProps } from '@/@types/rating'
import { Avatar } from '@/components/shared/Avatar'
import { useAppContext } from '@/contexts/AppContext'
import { useSession } from 'next-auth/react'
import { BookProps } from '@/@types/book'
import { FormErrors } from '@/components/core/FormErrors'
import { ActionButton } from '@/components/core/ActionButton'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { AnimatedRating } from '../AnimatedRating'
import { useBookContext } from '@/contexts/BookContext'
import { useRatings } from '@/contexts/RatingsContext'

interface RatingCardFormProps {
  isProfileScreen?: boolean
  isEdit?: boolean
  rating?: RatingProps | null
  book: BookProps
  onClose: () => void
}

const ratingCardFormSchema = z.object({
  description: z
    .string()
    .nullable()
    .optional()
    .superRefine((val, ctx) => {
      if (val && val.length > 0 && val.length < 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 100,
          type: 'string',
          inclusive: true,
          message: 'Description must be at least 100 characters long',
        })
      }
    }),
  rate: z
    .number()
    .positive({ message: 'Please choose a rating from 1 to 5.' })
    .max(5),
})

type RatingCardFormData = z.infer<typeof ratingCardFormSchema>

export function RatingCardForm({
  book,
  isProfileScreen = false,
  isEdit = false,
  rating = null,
  onClose,
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

  const {
    loggedUser,
    handleCreateReview,
    handleEditReview,
    isValidatingReview,
  } = useAppContext()

  const { updateRating } = useRatings()

  const { onUpdateRating, onUpdateUserRating } = useBookContext()

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

      const newRating = await handleCreateReview(payload)
      await onUpdateRating?.()
      onUpdateUserRating(newRating)
      onClose()
    }
  }

  async function editReview() {
    if (
      rating?.description === watch()?.description &&
      rating?.rate === watch()?.rate
    ) {
      onClose()
      return
    }

    if (rating && handleEditReview) {
      const data = watch()

      const payload = {
        rate: data.rate,
        description: data?.description || '',
        ratingId: rating.id,
      }

      const updatedRating = await handleEditReview(payload)

      updateRating(rating.id, updatedRating)
      onUpdateUserRating(updatedRating)
      onClose()
    }
  }

  return (
    loggedUser &&
    (isValidatingReview ? (
      <SkeletonRatingCard />
    ) : (
      <RatingCardFormWrapper
        onSubmit={handleSubmit(isEdit ? editReview : submitReview)}
        {...rest}
      >
        <RatingCardFormHeader className={isProfileScreen ? 'profile' : ''}>
          <UserDetailsWrapper>
            <Avatar
              isClickable={false}
              avatarUrl={loggedUser?.avatarUrl}
              variant="medium"
            />
            <p>{loggedUser.name}</p>
          </UserDetailsWrapper>
          <AnimatedRating
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
            minLength={REVIEW_MIN_LENGTH}
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
              className="delete_icon"
              disabled={isSubmitting}
              onClick={() => onClose()}
            >
              <X />
            </ActionButton>
            <ActionButton
              className="edit_icon"
              type="submit"
              disabled={isSubmitting}
            >
              <Check />
            </ActionButton>
          </UserActionsWrapper>
        </FooterWrapper>
      </RatingCardFormWrapper>
    ))
  )
}
