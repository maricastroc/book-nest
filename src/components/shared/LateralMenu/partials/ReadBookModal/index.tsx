import * as Dialog from '@radix-ui/react-dialog'
import {
  Content,
  CloseButton,
  ReadBookModalHeader,
  ReadBookModalContent,
  Title,
} from './styles'
import { Star, X } from 'phosphor-react'
import { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { getRatingMessage } from '@/utils/getRatingMessage'
import { CreateReviewData } from '@/pages/home/index.page'
import { CustomButton } from '@/components/shared/Button'
import { Overlay } from '@/styles/shared'

interface SignInModalProps {
  onClose: () => void
  bookId: string
  userId: string
  handleCreateReview: (data: CreateReviewData) => Promise<void>
  closeLateralMenu: () => void
}

export function ReadBookModal({
  closeLateralMenu,
  handleCreateReview,
  bookId,
  userId,
  onClose,
}: SignInModalProps) {
  const [rate, setRate] = useState<number | undefined>()

  const [isLoading, setIsLoading] = useState(false)

  const handleRating = (rate: number) => {
    setRate(rate)
  }

  async function submitReview() {
    if (handleCreateReview && rate) {
      setIsLoading(true)

      const payload = {
        rate,
        userId,
        bookId,
        description: '',
      }

      await handleCreateReview(payload)

      setIsLoading(false)

      closeLateralMenu()
    }
  }

  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" />
      <Content className="DialogContent">
        <ReadBookModalHeader>
          <Title className="DialogTitle">Rate your reading!</Title>
          <p>{rate !== undefined && getRatingMessage(rate)}</p>
          <CloseButton onClick={() => onClose()}>
            <X alt="Close" />
          </CloseButton>
        </ReadBookModalHeader>
        <ReadBookModalContent>
          <Rating
            allowFraction
            initialValue={rate}
            onClick={handleRating}
            emptyIcon={<Star size={20} />}
            fillIcon={<Star weight="fill" size={20} />}
            emptyColor="#8381D9"
            fillColor="#8381D9"
          />
        </ReadBookModalContent>
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
