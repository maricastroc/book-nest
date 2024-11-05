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
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { REVIEW_MAX_LENGTH } from '@/utils/constants'
import { FormErrors } from '@/components/shared/FormErrors'
import { RatingProps } from '@/@types/rating'
import { Avatar } from '@/components/Avatar'
import { useAppContext } from '@/contexts/AppContext'

interface RatingCardFormProps {
  isEdit?: boolean
  rating?: RatingProps | null
  avatarUrl: string
  name: string
  bookId: string
  userId: string | number | undefined
  onClose: () => void
  onCloseLateralMenu: () => void
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
  onCloseLateralMenu,
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

  const {
    refreshBooks,
    refreshPopularBooks,
    refreshLatestRatings,
    refreshUserLatestRatings,
  } = useAppContext()

  const characterCount = watch('description')?.split('').length || 0

  async function handleSubmitNewReview(data: RatingCardFormData) {
    try {
      await api.post(`/ratings/${bookId}`, {
        rate: data.rate,
        description: data.description,
        userId,
        bookId,
      })

      refreshBooks()
      refreshLatestRatings()
      refreshPopularBooks()
      refreshUserLatestRatings()
      onCloseLateralMenu()

      toast.success('Review successfully registered!')
    } catch (error) {
      handleAxiosError(error)
    }
  }

  async function handleEditReview() {
    const data = watch()

    if (rating) {
      try {
        const payload = {
          id: rating.id,
          description: data.description,
          rate: data.rate,
        }

        await api.put('/ratings', payload)

        refreshBooks()
        refreshLatestRatings()
        refreshUserLatestRatings()
        refreshPopularBooks()

        onCloseLateralMenu()

        toast.success('Review successfully edited!')
      } catch (error) {
        handleAxiosError(error)
      }
    }
  }

  return (
    <RatingCardFormWrapper
      onSubmit={handleSubmit(isEdit ? handleEditReview : handleSubmitNewReview)}
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
