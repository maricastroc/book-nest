import { Check, Star, X } from 'phosphor-react'
import {
  ActionButton,
  AvatarContainer,
  AvatarDefault,
  ButtonsContainer,
  CharacterCounter,
  Container,
  FormErrors,
  ReviewForm,
  ReviewFormContainer,
  ReviewFormHeader,
  UserData,
} from './styles'

import { Rating } from 'react-simple-star-rating'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'

interface ReviewCardFormProps {
  avatar_url: string
  name: string
  bookId: string
  userId: string | number | undefined
  onClose: () => void
  onCloseLateralMenu: () => void
}

const reviewCardFormSchema = z.object({
  description: z
    .string()
    .min(3, { message: 'Please, write your review before submit.' }),
  rating: z
    .number()
    .positive({ message: 'Please choose a rating from 1 to 5.' })
    .max(5),
})

type ReviewCardFormData = z.infer<typeof reviewCardFormSchema>

export function ReviewCardForm({
  avatar_url,
  name,
  bookId,
  userId,
  onClose,
  onCloseLateralMenu,
}: ReviewCardFormProps) {
  const [rating, setRating] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ReviewCardFormData>({
    resolver: zodResolver(reviewCardFormSchema),
    defaultValues: {
      rating,
    },
  })

  const handleRating = (rate: number) => {
    setRating(rate)
    setValue('rating', rate)
  }

  const characterCount = watch('description')?.split('').length || 0

  async function handleSubmitNewReview(data: ReviewCardFormData) {
    await api.post(`/ratings/${bookId}`, {
      rate: data.rating,
      description: data.description,
      userId,
      bookId,
    })
    onCloseLateralMenu()
    toast.success('Review successfully registered!')
  }

  return (
    <Container onSubmit={handleSubmit(handleSubmitNewReview)}>
      <ReviewFormHeader>
        <UserData>
          <AvatarContainer>
            <AvatarDefault src={avatar_url} />
          </AvatarContainer>
          <p>{name}</p>
        </UserData>
        <Rating
          onClick={handleRating}
          emptyIcon={<Star size={20} />}
          fillIcon={<Star weight="fill" size={20} />}
          emptyColor="#8381D9"
          fillColor="#8381D9"
          {...register('rating')}
        />
      </ReviewFormHeader>
      <ReviewFormContainer>
        <ReviewForm
          placeholder="Write your review here"
          maxLength={450}
          spellCheck={false}
          {...register('description')}
        />
        <CharacterCounter>
          <span>{characterCount}</span>/450
        </CharacterCounter>
      </ReviewFormContainer>
      {(errors.rating || errors.description) && (
        <FormErrors>
          <span>{errors.rating && errors.rating.message}</span>
          <span>{errors.description && errors.description.message}</span>
        </FormErrors>
      )}
      <ButtonsContainer>
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
      </ButtonsContainer>
    </Container>
  )
}
