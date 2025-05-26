import * as Dialog from '@radix-ui/react-dialog'
import { BaseModal } from '../BaseModal'
import { Button } from '@/components/core/Button'
import { useAppContext } from '@/contexts/AppContext'

interface DeleteModalProps {
  onConfirm: () => void
  onClose: () => void
}

export function DeleteModal({ onConfirm, onClose }: DeleteModalProps) {
  const { isValidatingReview } = useAppContext()

  return (
    <Dialog.Portal>
      <BaseModal title="Delete Review?" onClose={onClose}>
        <p>
          Are you sure you want to delete this review? This action cannot be
          reversed.
        </p>
        <Button
          style={{ marginTop: '2rem' }}
          content={isValidatingReview ? 'Loading...' : 'Confirm & Delete'}
          disabled={isValidatingReview}
          onClick={() => onConfirm()}
        />
      </BaseModal>
    </Dialog.Portal>
  )
}
