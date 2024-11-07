import {
  AddToLibraryDropdown,
  ReadingStatusItem,
  DividerDropdown,
} from './styles'
import { BookProps } from '@/@types/book'

interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  book: BookProps
  handleSelectReadingStatus: (status: string) => Promise<void>
  activeStatus: string | null
  dropdownRef: React.RefObject<HTMLDivElement>
  handleOpenReadBookModal: () => void
}

export const DropdownMenu = ({
  isOpen,
  activeStatus,
  handleOpenReadBookModal,
  onClose,
  handleSelectReadingStatus,
  dropdownRef,
}: DropdownMenuProps) => {
  const statuses = [
    { label: 'Read', className: 'read' },
    { label: 'Reading', className: 'reading' },
    { label: 'Did not Finish', className: 'dnf' },
    { label: 'Want to Read', className: 'wantread' },
  ]

  return isOpen ? (
    <AddToLibraryDropdown ref={dropdownRef}>
      {statuses.map((status) => (
        <>
          <ReadingStatusItem
            className={
              activeStatus
                ? activeStatus === status.label
                  ? 'selected'
                  : ''
                : ''
            }
            onClick={async () => {
              if (status.label === 'Read' && activeStatus !== 'Read') {
                handleOpenReadBookModal()
                return
              }

              await handleSelectReadingStatus(status.label)
              onClose()
            }}
          >
            {status.label}
          </ReadingStatusItem>
          <DividerDropdown />
        </>
      ))}
    </AddToLibraryDropdown>
  ) : null
}
