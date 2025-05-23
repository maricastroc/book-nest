import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/core/Button'
import { useRouter } from 'next/router'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { BaseModal } from '../BaseModal'

interface Props {
  onClose: () => void
}

export function SignInModal({ onClose }: Props) {
  const router = useRouter()

  const isRouteLoading = useLoadingOnRouteChange()

  return (
    <Dialog.Portal>
      <BaseModal title="You're not logged in!" onClose={onClose}>
        <p>
          Log in to save your favorite books, share your thoughts through
          reviews, and enjoy everything our platform has to offer!
        </p>

        <Button
          type="button"
          content="Sign In"
          onClick={() => {
            router.push('/')
          }}
          isSubmitting={isRouteLoading}
          style={{
            marginTop: '2rem',
          }}
        />
      </BaseModal>
    </Dialog.Portal>
  )
}
