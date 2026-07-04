import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faStar, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { REVIEW_MAX_LENGTH } from '@/utils/constants'
import { RatingProps } from '@/@types/rating'
import { Avatar } from '@/components/ui/Avatar'
import { useAppContext } from '@/contexts/AppContext'
import { useSession } from 'next-auth/react'
import { BookProps } from '@/@types/book'
import { FormErrors } from '@/components/ui/FormErrors'
import { SkeletonRatingCard } from '@/components/features/books/SkeletonRatingCard'
import { AnimatedRating } from './AnimatedRating'
import { useBookContext } from '@/contexts/BookContext'

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
  const { actions, bookData } = useBookContext()

  const handleRating = (rate: number) => setValue('rate', rate)
  const characterCount = watch('description')?.split('').length || 0

  async function submitReview() {
    if (session.data?.user) {
      const data = watch()
      const payload = {
        rate: data.rate,
        description: data?.description || '',
        userId: session.data.user.id.toString(),
        bookId: book.id.toString(),
        status: book.readingStatus,
      }
      const newRating = await handleCreateReview(payload)
      actions.updateUserRating?.(newRating)
      await actions.updateRating?.()
      await bookData.mutate()
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
      actions.updateUserRating?.(updatedRating)
      await actions.updateRating?.()
      if (rating?.rate !== data.rate) await bookData.mutate()
      onClose()
    }
  }

  if (!loggedUser) return null
  if (isValidatingReview) return <SkeletonRatingCard />

  return (
    <form
      onSubmit={handleSubmit(isEdit ? editReview : submitReview)}
      className="mx-auto my-2 flex w-full flex-col gap-3 rounded-xl border border-line bg-s2 p-4 sm:p-5"
      {...rest}
    >
      <div
        className={`flex w-full flex-col items-start gap-4 ${
          isProfileScreen
            ? 'sm:flex-row sm:items-center sm:justify-between'
            : 'sm:flex-row sm:items-center sm:justify-between'
        }`}
      >
        <div className="flex items-center gap-3">
          <Avatar
            isClickable={false}
            avatarUrl={loggedUser?.avatarUrl}
            variant="medium"
          />
          <p className="text-[0.95rem] font-bold text-fg">{loggedUser.name}</p>
        </div>
        <AnimatedRating
          initialValue={rating?.rate}
          onClick={handleRating}
          emptyIcon={<FontAwesomeIcon icon={faStar} style={{ fontSize: 16 }} />}
          fillIcon={<FontAwesomeIcon icon={faStar} style={{ fontSize: 16 }} />}
          emptyColor="#3a352a"
          fillColor="#e8b14c"
          {...register('rate')}
        />
      </div>

      <textarea
        placeholder="Write your review here"
        spellCheck={false}
        rows={6}
        className="w-full resize-none rounded-lg border border-line-strong bg-transparent px-3.5 pb-5 pt-3.5 text-[0.9rem] leading-[1.45rem] text-fg placeholder:text-fg3 focus:border-ac/60 focus:outline-none"
        {...register('description')}
      />

      <div className="flex w-full items-start justify-between">
        <div className="ml-0.5 flex flex-col gap-1">
          <span className="py-0.5 text-[0.75rem] text-fg2">
            <span>{characterCount}</span>/{REVIEW_MAX_LENGTH}
          </span>
          {(errors.rate || errors.description) && (
            <>
              <FormErrors error={errors?.rate?.message} />
              <FormErrors error={errors?.description?.message} />
            </>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2.5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onClose()}
            aria-label="Cancel"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-fg2 transition-colors hover:border-line-strong hover:text-fg disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label="Save review"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-ac text-ac-ink transition-[filter] hover:brightness-110 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
      </div>
    </form>
  )
}
