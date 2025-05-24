import * as Dialog from '@radix-ui/react-dialog'
import { Star } from 'phosphor-react'
import { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { getRatingMessage } from '@/utils/getRatingMessage'
import { RatingProps } from '@/@types/rating'
import { useAppContext } from '@/contexts/AppContext'
import { BaseModal } from '@/components/modals/BaseModal'
import { Button } from '@/components/core/Button'

interface RatingBookModalProps {
  onClose: () => void
  bookId: string
  userId: string | number
  onCreateReview: (newRating: RatingProps) => void
  bookStatus: string
}

export function RatingBookModal({
  onCreateReview,
  bookId,
  userId,
  bookStatus,
  onClose,
}: RatingBookModalProps) {
  const [rate, setRate] = useState<number | undefined>()

  const [isLoading, setIsLoading] = useState(false)

  const { handleCreateReview } = useAppContext()

  const handleRating = (rate: number) => {
    setRate(rate)
  }

  async function submitReview() {
    if (rate) {
      setIsLoading(true)

      const payload = {
        rate,
        userId,
        bookId,
        status: bookStatus,
        description: '',
      }

      const createdRating = await handleCreateReview(payload)
      onCreateReview(createdRating)
      onClose()

      setIsLoading(false)
    }
  }

  return (
    <Dialog.Portal>
      <BaseModal
        hasAlignMiddleContent
        showCloseButton={false}
        title="Rate your reading!"
        onClose={() => {
          setRate(undefined)
          onClose()
        }}
      >
        <p style={{ marginBottom: '0.5rem' }}>
          {rate !== undefined && getRatingMessage(rate)}
        </p>

        <Rating
          allowFraction
          initialValue={rate}
          onClick={handleRating}
          emptyIcon={<Star size={24} />}
          fillIcon={<Star weight="fill" size={24} />}
          emptyColor="#8381D9"
          fillColor="#8381D9"
        />
        <Button
          style={{ marginTop: '2rem' }}
          content="Confirm"
          disabled={rate === undefined || isLoading}
          onClick={submitReview}
        />
      </BaseModal>
    </Dialog.Portal>
  )
}
