import * as Dialog from '@radix-ui/react-dialog'
import {
  Overlay,
  Description,
  Title,
  Content,
  CloseButton,
  ConfirmButton,
} from './styles'
import { X } from 'phosphor-react'

interface DeleteModalProps {
  onConfirm: () => void
}

export function DeleteModal({ onConfirm }: DeleteModalProps) {
  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" />
      <Content className="DialogContent">
        <CloseButton>
          <X size={18} alt="Delete Post" />
        </CloseButton>
        <Title className="DialogTitle">{`Delete this review?`}</Title>
        <Description className="DialogDescription">
          Are you sure you want to delete this review? This action cannot be
          reversed.
        </Description>
        <ConfirmButton onClick={() => onConfirm()}>
          Confirm & Delete
        </ConfirmButton>
      </Content>
    </Dialog.Portal>
  )
}
