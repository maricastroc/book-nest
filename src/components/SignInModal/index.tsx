import * as Dialog from '@radix-ui/react-dialog'
import { Overlay, Content, CloseButton, LoginModalContainer } from './styles'
import LoginForm from '../SignInForm'
import { X } from 'phosphor-react'

interface SignInModalProps {
  onClose: () => void
}

export function SignInModal({ onClose }: SignInModalProps) {
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
