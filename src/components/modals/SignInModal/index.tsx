import * as Dialog from '@radix-ui/react-dialog'
import {
  Content,
  CloseButton,
  LoginModalContainer,
  SignInModalHeader,
} from './styles'
import LoginForm from '@/components/shared/SignInForm'
import { X } from 'phosphor-react'
import { Overlay } from '@/styles/shared'

interface SignInModalProps {
  onClose: () => void
}

export function SignInModal({ onClose }: SignInModalProps) {
  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" />
      <Content className="DialogContent">
        <SignInModalHeader>
          <h2>Please, sign in to enjoy our platform.</h2>
          <CloseButton onClick={() => onClose()}>
            <X alt="Close" />
          </CloseButton>
        </SignInModalHeader>
        <LoginModalContainer>
          <LoginForm onClose={() => onClose()} />
        </LoginModalContainer>
      </Content>
    </Dialog.Portal>
  )
}
