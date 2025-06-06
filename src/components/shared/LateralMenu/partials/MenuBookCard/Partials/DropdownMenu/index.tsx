import {
  AddToLibraryDropdown,
  ReadingStatusItem,
  RemoveFromLibraryItem,
  DividerDropdown,
} from './styles'
import { BookProps } from '@/@types/book'
import { useAppContext } from '@/contexts/AppContext'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { ReadingStatusTag } from '@/components/shared/ReadingStatusTag'
import { ReadingStatus, statuses } from '@/@types/reading-status'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import toast from 'react-hot-toast'

interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  book: BookProps
  activeStatus: ReadingStatus | null
  dropdownRef: React.RefObject<HTMLDivElement>
  setIsValidatingStatus: (value: boolean) => void
  onUpdateStatus: (newStatus: ReadingStatus | null) => void
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

  const handleSelectReadingStatus = async (
    book: BookProps,
    status: ReadingStatus,
  ) => {
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

  const handleRemoveFromLibrary = async () => {
    if (loggedUser && book) {
      setIsValidatingStatus(true)

      try {
        await api.delete('/reading_status', {
          data: {
            userId: loggedUser.id,
            bookId: book.id,
          },
        })

        toast.success('Book removed from your library!')
        onUpdateStatus(null)
        onClose()
      } catch (error) {
        handleApiError(error)
      } finally {
        setIsValidatingStatus(false)
        onClose()
      }
    }
  }

  return isOpen ? (
    <AddToLibraryDropdown ref={dropdownRef}>
      {statuses?.map((status) => (
        <>
          <ReadingStatusItem
            className={
              activeStatus
                ? activeStatus === status.value
                  ? 'selected'
                  : ''
                : ''
            }
            onClick={async () => {
              if (activeStatus === status.value) {
                return
              }

              await handleSelectReadingStatus(book, status.value)
              onUpdateStatus(status.value)
              onClose()
            }}
          >
            <ReadingStatusTag
              type="relative"
              readingStatus={status.value as ReadingStatus}
            />
            {status.label}
          </ReadingStatusItem>

          <DividerDropdown />
        </>
      ))}

      {activeStatus !== null && (
        <RemoveFromLibraryItem
          onClick={() => {
            handleRemoveFromLibrary()
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
          Remove from library
        </RemoveFromLibraryItem>
      )}
    </AddToLibraryDropdown>
  ) : null
}
