import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import {
  AddToLibraryDropdown,
  ReadingStatusItem,
  DividerDropdown,
} from './styles'
import { BookProps } from '@/@types/book'
import { useAppContext } from '@/contexts/AppContext'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { handleApiError } from '@/utils/handleApiError'

interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  book: BookProps
  activeStatus: string | null
  dropdownRef: React.RefObject<HTMLDivElement>
  setIsValidatingStatus: (value: boolean) => void
  onUpdateStatus: (newStatus: string) => void
}

export const DropdownMenu = ({
  isOpen,
  activeStatus,
  book,
  onUpdateStatus,
  onClose,
  setIsValidatingStatus,
  dropdownRef,
}: DropdownMenuProps) => {
  const { loggedUser } = useAppContext()

  const statuses = [
    { label: 'Read', className: 'read' },
    { label: 'Reading', className: 'reading' },
    { label: 'Did not Finish', className: 'dnf' },
    { label: 'Want to Read', className: 'wantread' },
  ]

  const handleSelectReadingStatus = async (book: BookProps, status: string) => {
    if (loggedUser && book) {
      setIsValidatingStatus(true)

      try {
        await api.post('/reading_status', {
          userId: loggedUser.id,
          bookId: book.id,
          status,
        })

        toast.success('Status successfully updated!')
      } catch (error) {
        handleApiError(error)
      } finally {
        setIsValidatingStatus(false)
      }
    }
  }

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
            onClick={async () => {
              if (
                formatToSnakeCase(activeStatus ?? '') ===
                formatToSnakeCase(status.label)
              ) {
                return
              }

              await handleSelectReadingStatus(book, status.label)
              onUpdateStatus(status.label)

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
