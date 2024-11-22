import * as Dialog from '@radix-ui/react-dialog'
import { Overlay } from '@/styles/shared'
import { RatingCardForm } from '@/components/shared/RatingCardForm'
import { RatingProps } from '@/@types/rating'
import { Content } from './styles'
import { BookProps } from '@/@types/book'

interface EditUserReviewModalProps {
  rating: RatingProps
  book: BookProps
  onClose: () => void
  onUpdateReview: (updatedReview: RatingProps) => void
  onCreateReview: (newRating: RatingProps) => void
}

export function EditUserReviewModal({
  rating,
  book,
  onClose,
  onUpdateReview,
  onCreateReview,
}: EditUserReviewModalProps) {
  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" onClick={onClose} />
      <Content className="DialogContent">
        <RatingCardForm
          isEdit
          isProfileScreen
          onClose={onClose}
          rating={rating}
          book={book}
          onUpdateReview={onUpdateReview}
          onCreateReview={onCreateReview}
        />
      </Content>
    </Dialog.Portal>
  )
}
