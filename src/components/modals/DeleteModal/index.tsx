import * as Dialog from '@radix-ui/react-dialog'
import { BaseModal } from '../BaseModal'
import { Button } from '@/components/core/Button'
import { useAppContext } from '@/contexts/AppContext'

interface DeleteModalProps {
  onConfirm: () => void
  onClose: () => void
}

export function DeleteModal({ onConfirm, onClose }: DeleteModalProps) {
  const { isSubmitting } = useAppContext()

  return (
    <Dialog.Portal>
      <BaseModal title="Delete Review?" onClose={onClose}>
        <p>
          Are you sure you want to delete this review? This action cannot be
          reversed.
        </p>
        <Button
          style={{ marginTop: '2rem' }}
          content={isSubmitting ? 'Loading...' : 'Confirm & Delete'}
          disabled={isSubmitting}
          onClick={() => onConfirm()}
        />
      </BaseModal>
    </Dialog.Portal>
  )
}
