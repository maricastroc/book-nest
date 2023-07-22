import * as Dialog from '@radix-ui/react-dialog'
import { Icon } from '@iconify/react'
import {
  Overlay,
  Description,
  Title,
  Content,
  CloseButton,
  ButtonsContainer,
  ButtonAccess,
} from './styles'
import { X } from 'phosphor-react'
import { signIn } from 'next-auth/react'

export function LoginModal() {
  async function handleSignIn(provider: string) {
    if (provider === 'google') {
      await signIn('google', { callbackUrl: '/home' })
    } else if (provider === 'github') {
      await signIn('github', { callbackUrl: '/home' })
    }
  }

  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" />
      <Content className="DialogContent">
        <CloseButton>
          <X alt="Delete Post" />
        </CloseButton>
        <Title className="DialogTitle">Please, login to review a book</Title>
        <Description className="DialogDescription">
          <ButtonsContainer>
            <ButtonAccess onClick={() => handleSignIn('google')}>
              <Icon icon="flat-color-icons:google" />
              <p>Login with Google</p>
            </ButtonAccess>
            <ButtonAccess onClick={() => handleSignIn('github')}>
              <Icon icon="ant-design:github-outlined" color="white" />
              <p>Login with GitHub</p>
            </ButtonAccess>
          </ButtonsContainer>
        </Description>
      </Content>
    </Dialog.Portal>
  )
}
