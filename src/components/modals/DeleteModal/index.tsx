import * as Dialog from '@radix-ui/react-dialog'
import { BaseModal } from '../BaseModal'
import { Button } from '@/components/core/Button'

interface DeleteModalProps {
  onConfirm: () => void
  onClose: () => void
}

export function DeleteModal({ onConfirm, onClose }: DeleteModalProps) {
  return (
    <Dialog.Portal>
      <BaseModal title="Delete Review?" onClose={onClose}>
        <p>
          Are you sure you want to delete this review? This action cannot be
          reversed.
        </p>
        <Button
          style={{ marginTop: '2rem' }}
          content="Confirm & Delete"
          onClick={() => onConfirm()}
        />
      </BaseModal>
    </Dialog.Portal>
  )
}
