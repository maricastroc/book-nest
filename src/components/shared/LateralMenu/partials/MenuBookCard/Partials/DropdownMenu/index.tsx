import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import {
  AddToLibraryDropdown,
  ReadingStatusItem,
  DividerDropdown,
} from './styles'
import { BookProps } from '@/@types/book'
import { useAppContext } from '@/contexts/AppContext'
import { shouldOpenRatingModal } from '@/utils/shouldOpenRatingModal'

interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  book: BookProps
  activeStatus: string | null
  dropdownRef: React.RefObject<HTMLDivElement>
  handleOpenRatingBookModal: (status: string) => void
  closeLateralMenu: () => void
}

export const DropdownMenu = ({
  isOpen,
  activeStatus,
  book,
  handleOpenRatingBookModal,
  closeLateralMenu,
  onClose,
  dropdownRef,
}: DropdownMenuProps) => {
  const { handleSelectReadingStatus, isValidating } = useAppContext()

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
                ? formatToSnakeCase(activeStatus) ===
                  formatToSnakeCase(status.label)
                  ? 'selected'
                  : ''
                : ''
            }
            disabled={isValidating}
            onClick={async () => {
              if (
                formatToSnakeCase(activeStatus ?? '') ===
                formatToSnakeCase(status.label)
              ) {
                return
              }

              if (shouldOpenRatingModal(status.label, activeStatus)) {
                handleOpenRatingBookModal(status.label)
                return
              }

              await handleSelectReadingStatus(book, status.label)

              closeLateralMenu()
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
