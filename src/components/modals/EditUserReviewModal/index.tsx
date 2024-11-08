import * as Dialog from '@radix-ui/react-dialog'
import { Overlay } from '@/styles/shared'
import { RatingCardForm } from '@/components/shared/RatingCardForm'
import { RatingProps } from '@/@types/rating'
import { EditReviewData } from '@/pages/home/index.page'
import { Content } from './styles'

interface EditUserReviewModalProps {
  rating: RatingProps
  bookId: string
  handleEditReview?: (data: EditReviewData) => void
  onClose: () => void
}

export function EditUserReviewModal({
  rating,
  bookId,
  handleEditReview,
  onClose,
}: EditUserReviewModalProps) {
  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" onClick={onClose} />
      <Content className="DialogContent">
        <RatingCardForm
          onClose={onClose}
          handleEditReview={handleEditReview}
          isEdit
          rating={rating}
          bookId={bookId}
          isProfileScreen
        />
      </Content>
    </Dialog.Portal>
  )
}
