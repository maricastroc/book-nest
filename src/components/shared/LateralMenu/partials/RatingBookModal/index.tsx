import * as Dialog from '@radix-ui/react-dialog'
import {
  Content,
  CloseButton,
  RatingBookModalHeader,
  RatingBookModalContent,
  Title,
} from './styles'
import { Star, X } from 'phosphor-react'
import { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { getRatingMessage } from '@/utils/getRatingMessage'
import { CustomButton } from '@/components/shared/Button'
import { Overlay } from '@/styles/shared'
import { RatingProps } from '@/@types/rating'
import { useAppContext } from '@/contexts/AppContext'

interface RatingBookModalProps {
  onClose: () => void
  bookId: string
  userId: string
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
      <Overlay className="DialogOverlay" />
      <Content className="DialogContent">
        <RatingBookModalHeader>
          <Title className="DialogTitle">Rate your reading!</Title>
          <p>{rate !== undefined && getRatingMessage(rate)}</p>
          <CloseButton onClick={() => onClose()}>
            <X alt="Close" />
          </CloseButton>
        </RatingBookModalHeader>
        <RatingBookModalContent>
          <Rating
            allowFraction
            initialValue={rate}
            onClick={handleRating}
            emptyIcon={<Star size={20} />}
            fillIcon={<Star weight="fill" size={20} />}
            emptyColor="#8381D9"
            fillColor="#8381D9"
          />
        </RatingBookModalContent>
        <CustomButton
          hasRoundedBorder={false}
          style={{ marginTop: '2rem' }}
          content="Confirm"
          isDisabled={rate === undefined}
          onClick={submitReview}
          disabled={rate === undefined || isLoading}
        />
      </Content>
    </Dialog.Portal>
  )
}
