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
  isCompact?: boolean
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
  isCompact = false,
  hasAlignMiddleContent = false,
  showCloseButton = true,
}: BaseModalProps) {
  const widthClass = isLarger
    ? 'sm:max-w-160'
    : isCompact
    ? 'sm:max-w-96'
    : 'sm:max-w-120'

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        onClick={onClose}
        className="fixed inset-0 z-9997 bg-black/70 backdrop-blur-[2px]"
      />

      <ModalContent>
        <Dialog.Content
          onEscapeKeyDown={onClose}
          aria-describedby={undefined}
          className={`bn-scope animate-sheet-up fixed inset-x-0 bottom-0 z-9998 flex max-h-[90dvh] w-full flex-col rounded-t-feature border border-b-0 border-line bg-s2 shadow-[0_-8px_40px_rgba(0,0,0,0.5)] outline-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[88vh] sm:w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-feature sm:border-b sm:shadow-[0_24px_60px_rgba(0,0,0,0.6)] ${widthClass}`}
        >
          {/* Grab handle — bottom-sheet affordance on mobile only */}
          <div
            aria-hidden
            className="mx-auto mt-3 h-1 w-9 shrink-0 rounded-full bg-line-strong sm:hidden"
          />

          {title && (
            <div className="flex shrink-0 items-start justify-between gap-4 px-7 pt-5 md:px-9 md:pt-8 sm:pt-7">
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
                  className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-fg3 transition-colors hover:bg-el hover:text-fg sm:-mr-1.5 sm:-mt-1.5 sm:h-8 sm:w-8"
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon icon={faXmark} style={{ fontSize: 18 }} />
                </Dialog.Close>
              )}
            </div>
          )}

          <div
            className={`lateral-menu-scroll flex-1 overflow-y-auto overscroll-contain px-7 pt-6 md:px-9 ${
              footer ? 'pb-6' : 'pb-safe-6'
            } ${hasAlignMiddleContent ? 'flex flex-col items-center' : ''}`}
          >
            {children}
          </div>

          {footer && (
            <div className="pb-safe-4 shrink-0 border-t border-line px-7 pt-4 md:px-9">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </ModalContent>
    </Dialog.Portal>
  )
}
