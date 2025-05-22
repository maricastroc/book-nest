import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'
import { Button } from '@/components/core/Button'
import {
  ModalCloseButton,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
} from '@/styles/shared'
import { useRouter } from 'next/router'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'

interface Props {
  hasOverlay?: boolean
  onClose: () => void
}

export function SignInModal({ onClose, hasOverlay = true }: Props) {
  const router = useRouter()

  const isRouteLoading = useLoadingOnRouteChange()

  return (
    <Dialog.Portal>
      <ModalOverlay
        className="DialogOverlay"
        hasOverlay={hasOverlay}
        onClick={() => onClose()}
      />

      <ModalContent className="DialogContent">
        <ModalHeader>
          <ModalTitle className="DialogTitle">
            Ooops... You&apos;re not logged in!
          </ModalTitle>
          <ModalCloseButton onClick={() => onClose()}>
            <X alt="Close" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalDescription className="DialogDescription">
          <p>Sign in to bookmark and revisit your favorite media anytime!</p>
        </ModalDescription>

        <Button
          type="button"
          content="Sign In"
          onClick={() => {
            router.push('/')
          }}
          isSubmitting={isRouteLoading}
          style={{
            marginTop: '1rem',
          }}
        />
      </ModalContent>
    </Dialog.Portal>
  )
}
