import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { ModalContent } from '@/components/ui/animations/ModalAnimation'

interface BaseModalProps {
  onClose: () => void
  title?: string
  isLarger?: boolean
  hasAlignMiddleContent?: boolean
  children: ReactNode
  showCloseButton?: boolean
}

export function BaseModal({
  onClose,
  title,
  children,
  isLarger = false,
  hasAlignMiddleContent = false,
  showCloseButton = true,
}: BaseModalProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        onClick={onClose}
        className="fixed inset-0 z-9997 h-screen w-screen bg-black/70"
      />

      <ModalContent>
        <Dialog.Content
          className={[
            'fixed left-1/2 top-1/2 z-9998 flex max-h-[80vh] -translate-x-1/2 -translate-y-1/2',
            'flex-col items-start justify-start overflow-y-auto rounded-xl',
            'border border-line bg-s1 p-6 shadow-[0_15px_30px_rgba(0,0,0,0.5)]',
            'focus:outline-none md:p-8',
            isLarger
              ? 'w-[clamp(320px,90vw,700px)]'
              : 'w-[clamp(300px,85vw,460px)]',
          ].join(' ')}
        >
          {title && (
            <div
              className={`mb-6 flex w-full items-center justify-between ${
                hasAlignMiddleContent ? 'text-center' : ''
              }`}
            >
              <Dialog.Title
                className={`text-[1.25rem] font-light text-fg sm:text-[1.5rem] ${
                  hasAlignMiddleContent ? 'w-full text-center' : 'w-[90%]'
                }`}
              >
                {title}
              </Dialog.Title>
              {showCloseButton && (
                <Dialog.Close
                  onClick={onClose}
                  className="flex w-6 cursor-pointer items-center justify-end border-0 bg-transparent text-fg2 transition-colors hover:text-fg focus:outline-none"
                >
                  <FontAwesomeIcon icon={faXmark} style={{ fontSize: 20 }} />
                </Dialog.Close>
              )}
            </div>
          )}
          <Dialog.Description
            className={[
              'w-full text-left text-[0.9375rem] leading-[160%] text-fg2',
              hasAlignMiddleContent
                ? 'flex flex-col items-center justify-center'
                : '',
            ].join(' ')}
          >
            {children}
          </Dialog.Description>
        </Dialog.Content>
      </ModalContent>
    </Dialog.Portal>
  )
}
