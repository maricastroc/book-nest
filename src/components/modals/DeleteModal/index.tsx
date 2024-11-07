import * as Dialog from '@radix-ui/react-dialog'
import { Title, Content, CloseButton } from './styles'
import { X } from 'phosphor-react'
import { Overlay, Description } from '@/styles/shared'
import { CustomButton } from '@/components/shared/Button'

interface DeleteModalProps {
  onConfirm: () => void
}

export function DeleteModal({ onConfirm }: DeleteModalProps) {
  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" />
      <Content className="DialogContent">
        <CloseButton>
          <X size={18} alt="Delete Review" />
        </CloseButton>
        <Title className="DialogTitle">{`Delete this review?`}</Title>
        <Description className="DialogDescription">
          Are you sure you want to delete this review? This action cannot be
          reversed.
        </Description>
        <CustomButton
          hasRoundedBorder={false}
          style={{ marginTop: '2rem' }}
          content="Confirm & Delete"
          onClick={() => onConfirm()}
        />
      </Content>
    </Dialog.Portal>
  )
}
