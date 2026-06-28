import * as Dialog from '@radix-ui/react-dialog'
import { BaseModal } from '../BaseModal'
import { useAppContext } from '@/contexts/AppContext'

interface DeleteModalProps {
  onConfirm: () => void
  onClose: () => void
}

export function DeleteModal({ onConfirm, onClose }: DeleteModalProps) {
  const { isValidatingReview } = useAppContext()

  return (
    <Dialog.Portal>
      <BaseModal
        title="Delete Review?"
        description="This action cannot be reversed."
        onClose={onClose}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line px-4 py-2.5 text-[14px] font-medium text-fg2 transition-colors hover:border-line-strong hover:text-fg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isValidatingReview}
              className="rounded-lg bg-st-reading px-5 py-2.5 text-[14px] font-semibold text-white transition-[filter] hover:brightness-110 disabled:opacity-60"
            >
              {isValidatingReview ? 'Deleting...' : 'Delete Review'}
            </button>
          </div>
        }
      >
        <p className="text-[14px] leading-relaxed text-fg2">
          Are you sure you want to delete this review? Your rating and comment
          will be permanently removed.
        </p>
      </BaseModal>
    </Dialog.Portal>
  )
}
