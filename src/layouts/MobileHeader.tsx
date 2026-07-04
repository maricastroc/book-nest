import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { MobileSidebar } from '@/layouts/MobileSidebar'

export function MobileHeader({ ...rest }) {
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  return (
    <div
      className="bn-scope pt-header-bar fixed top-0 z-9995 flex w-full flex-col border-b border-line bg-s1 px-6 pb-4 sm:px-8 sm:pb-5"
      {...rest}
    >
      <header className="flex w-full items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-ac text-ac-ink">
            <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: 18 }} />
          </div>
          <div className="leading-none">
            <div className="font-serif text-[18px] font-semibold tracking-tight text-fg">
              booknest
            </div>
            <div className="mt-1.25 text-[8.5px] uppercase tracking-[0.18em] text-fg3">
              reading journal
            </div>
          </div>
        </div>

        <Dialog.Root open={isLateralMenuOpen}>
          <Dialog.Trigger asChild>
            <button
              onClick={() => setIsLateralMenuOpen(!isLateralMenuOpen)}
              className="-mr-2 flex h-11 w-11 items-center justify-center border-none bg-transparent text-fg transition-colors hover:text-fg2"
              aria-label="Open menu"
            >
              <FontAwesomeIcon icon={faBars} style={{ fontSize: 22 }} />
            </button>
          </Dialog.Trigger>
          <MobileSidebar onClose={() => setIsLateralMenuOpen(false)} />
        </Dialog.Root>
      </header>
    </div>
  )
}
