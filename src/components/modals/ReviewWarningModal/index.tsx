import * as Dialog from '@radix-ui/react-dialog'
import { Content, CloseButton, Title } from './styles'
import { X } from 'phosphor-react'
import { CustomButton } from '@/components/shared/Button'
import { Overlay } from '@/styles/shared'

interface ReviewWarningModalProps {
  onClose: () => void
}

export function ReviewWarningModal({ onClose }: ReviewWarningModalProps) {
  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" onClick={onClose} />
      <Content className="DialogContent">
        <Title className="DialogTitle">Ooops!</Title>
        <p>You need to mark this book as Read in order to write a review.</p>
        <CloseButton onClick={() => onClose()}>
          <X alt="Close" />
        </CloseButton>
        <CustomButton
          hasRoundedBorder={false}
          style={{ marginTop: '2rem' }}
          content="Got it!"
          onClick={onClose}
        />
      </Content>
    </Dialog.Portal>
  )
}
