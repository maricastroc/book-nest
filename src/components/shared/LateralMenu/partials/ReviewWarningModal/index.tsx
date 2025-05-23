import * as Dialog from '@radix-ui/react-dialog'
import { BaseModal } from '@/components/modals/BaseModal'
import { Button } from '@/components/core/Button'

interface ReviewWarningModalProps {
  onClose: () => void
}

export function ReviewWarningModal({ onClose }: ReviewWarningModalProps) {
  return (
    <Dialog.Portal>
      <BaseModal onClose={onClose} title="Ooops!">
        <p>
          You need to mark this book as{' '}
          <span style={{ fontWeight: 700 }}>Read</span> or as{' '}
          <span style={{ fontWeight: 700 }}>Did not finish</span> in order to
          write a review.
        </p>
        <Button
          style={{ marginTop: '2rem' }}
          content="Got it!"
          onClick={onClose}
        />
      </BaseModal>
    </Dialog.Portal>
  )
}
