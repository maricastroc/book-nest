import * as Dialog from '@radix-ui/react-dialog'
import { Overlay, Content, CloseButton, LoginModalContainer } from './styles'
import LoginForm from '../LoginForm'
import { X } from 'phosphor-react'

interface LoginModalProps {
  onClose: () => void
}

export function LoginModal({ onClose }: LoginModalProps) {
  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" />
      <Content className="DialogContent">
        <LoginModalContainer>
          <CloseButton onClick={() => onClose()}>
            <X alt="Close" />
          </CloseButton>
          <LoginForm onClose={() => onClose()} />
        </LoginModalContainer>
      </Content>
    </Dialog.Portal>
  )
}
