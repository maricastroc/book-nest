import * as Dialog from '@radix-ui/react-dialog'
import { Overlay } from '@/styles/shared'
import { RatingCardForm } from '@/components/shared/RatingCardForm'
import { RatingProps } from '@/@types/rating'
import { Content } from './styles'

interface EditUserReviewModalProps {
  rating: RatingProps
  bookId: string
  onClose: () => void
  updateUserRatings: () => Promise<void>
}

export function EditUserReviewModal({
  rating,
  bookId,
  onClose,
  updateUserRatings,
}: EditUserReviewModalProps) {
  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" onClick={onClose} />
      <Content className="DialogContent">
        <RatingCardForm
          isEdit
          onClose={() => {
            updateUserRatings()
            onClose()
          }}
          rating={rating}
          bookId={bookId}
          isProfileScreen
        />
      </Content>
    </Dialog.Portal>
  )
}
