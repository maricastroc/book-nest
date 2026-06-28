import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { ModalContent } from '@/components/ui/animations/ModalAnimation'

interface BaseModalProps {
  onClose: () => void
  title?: string
  description?: string
  footer?: ReactNode
  isLarger?: boolean
  hasAlignMiddleContent?: boolean
  children: ReactNode
  showCloseButton?: boolean
}

export function BaseModal({
  onClose,
  title,
  description,
  footer,
  children,
  isLarger = false,
  hasAlignMiddleContent = false,
  showCloseButton = true,
}: BaseModalProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        onClick={onClose}
        className="fixed inset-0 z-[9997] bg-black/70 backdrop-blur-[2px]"
      />

      <ModalContent>
        <Dialog.Content
          onEscapeKeyDown={onClose}
          aria-describedby={undefined}
          className={`bn-scope fixed left-1/2 top-1/2 z-[9998] flex max-h-[88vh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-feature border border-line bg-s2 shadow-[0_24px_60px_rgba(0,0,0,0.6)] outline-none ${
            isLarger ? 'sm:max-w-[40rem]' : 'sm:max-w-[30rem]'
          }`}
        >
          {title && (
            <div className="flex shrink-0 items-start justify-between gap-4 px-7 pt-7 md:px-9 md:pt-8">
              <div
                className={hasAlignMiddleContent ? 'w-full text-center' : ''}
              >
                <Dialog.Title className="font-serif text-[22px] font-semibold leading-tight tracking-tight text-fg">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-1 text-[13px] text-fg2">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showCloseButton && (
                <Dialog.Close
                  onClick={onClose}
                  className="-mr-1.5 -mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg3 transition-colors hover:bg-el hover:text-fg"
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon icon={faXmark} style={{ fontSize: 18 }} />
                </Dialog.Close>
              )}
            </div>
          )}

          <div
            className={`lateral-menu-scroll flex-1 overflow-y-auto px-7 py-6 md:px-9 ${
              hasAlignMiddleContent ? 'flex flex-col items-center' : ''
            }`}
          >
            {children}
          </div>

          {footer && (
            <div className="shrink-0 border-t border-line px-7 py-4 md:px-9">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </ModalContent>
    </Dialog.Portal>
  )
}
