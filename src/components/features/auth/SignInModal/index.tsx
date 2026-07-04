import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faBookOpen,
  faBookmark,
  faStar,
  faRightToBracket,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/Button'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'

type SignInContext = 'default' | 'library' | 'review'

interface Props {
  onClose: () => void
  context?: SignInContext
}

const content: Record<
  SignInContext,
  { icon: IconDefinition; title: string; description: string }
> = {
  default: {
    icon: faBookOpen,
    title: 'Continue your reading journey',
    description:
      'Sign in to save books, write reviews, and keep track of your reading.',
  },
  library: {
    icon: faBookmark,
    title: 'Want to save this book?',
    description:
      'Sign in to add it to your library and keep track of what you’re reading.',
  },
  review: {
    icon: faStar,
    title: 'Want to share your thoughts?',
    description:
      'Sign in to rate this book, write reviews, and track your progress.',
  },
}

export function SignInModal({ onClose, context = 'default' }: Props) {
  const router = useRouter()
  const isRouteLoading = useLoadingOnRouteChange()

  const { icon, title, description } = content[context]

  return (
    <Dialog.Portal>
      <Dialog.Overlay asChild>
        <motion.div
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-9997 bg-black/70 backdrop-blur-lg"
        />
      </Dialog.Overlay>

      <div className="pointer-events-none fixed inset-0 z-9998 flex items-center justify-center overflow-y-auto p-4">
        <Dialog.Content asChild onEscapeKeyDown={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="bn-scope pointer-events-auto relative flex w-full max-w-105 flex-col items-center rounded-feature border border-line bg-s2 px-8 pb-8 pt-10 text-center shadow-[0_25px_70px_rgba(0,0,0,0.55)] outline-none"
          >
            <Dialog.Close
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-md text-fg3 transition-colors hover:text-fg sm:right-4 sm:top-4 sm:h-8 sm:w-8"
            >
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: 17 }} />
            </Dialog.Close>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ac-soft text-ac">
              <FontAwesomeIcon icon={icon} style={{ fontSize: 24 }} />
            </div>

            <Dialog.Title className="font-serif text-[21px] font-semibold leading-tight tracking-tight text-fg">
              {title}
            </Dialog.Title>

            <Dialog.Description className="mt-2.5 max-w-75 text-[13.5px] leading-relaxed text-fg2">
              {description}
            </Dialog.Description>

            <div className="mt-7 flex w-full flex-col items-center gap-3">
              <Button
                type="button"
                content="Sign In"
                icon={faRightToBracket}
                onClick={() => router.push('/')}
                isSubmitting={isRouteLoading}
              />
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-[13px] font-medium text-fg3 transition-colors hover:text-fg2"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  )
}
