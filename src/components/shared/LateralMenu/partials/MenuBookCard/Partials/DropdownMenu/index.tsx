import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import {
  AddToLibraryDropdown,
  ReadingStatusItem,
  DividerDropdown,
  WarningMessage,
} from './styles'
import { BookProps } from '@/@types/book'
import { useAppContext } from '@/contexts/AppContext'
import { RatingProps } from '@/@types/rating'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { handleApiError } from '@/utils/handleApiError'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  book: BookProps
  activeStatus: string | null
  dropdownRef: React.RefObject<HTMLDivElement>
  handleOpenRatingBookModal: (status: string) => void
  onUpdateStatus: (
    book: BookProps,
    newStatus: string,
    userRating: number,
  ) => void
}

export const DropdownMenu = ({
  isOpen,
  activeStatus,
  book,
  handleOpenRatingBookModal,
  onUpdateStatus,
  onClose,
  dropdownRef,
}: DropdownMenuProps) => {
  const [userRating, setUserRating] = useState<RatingProps | null>(null)

  const { loggedUser, handleSetIsSubmitting } = useAppContext()

  const statuses = [
    { label: 'Read', className: 'read' },
    { label: 'Reading', className: 'reading' },
    { label: 'Did not Finish', className: 'dnf' },
    { label: 'Want to Read', className: 'wantread' },
  ]

  const handleSelectReadingStatus = async (book: BookProps, status: string) => {
    if (loggedUser && book) {
      try {
        handleSetIsSubmitting(true)

        await api.post('/reading_status', {
          userId: loggedUser.id,
          bookId: book.id,
          status,
        })

        toast.success('Status successfully updated!')
      } catch (error) {
        handleApiError(error)
      } finally {
        handleSetIsSubmitting(false)
      }
    }
  }

  useEffect(() => {
    async function fetchUserRating(bookId: string): Promise<void> {
      try {
        const response = await api.get(`/ratings/user`, {
          params: {
            bookId,
          },
        })

        if (response.data) {
          setUserRating(response.data.userRating)
        }
      } catch (error) {
        console.error('Error fetching user rating:', error)
      }
    }

    if (book) {
      fetchUserRating(book.id)
    }
  }, [book])

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

              if (
                !userRating &&
                (status.label === 'Read' || status.label === 'Did not Finish')
              ) {
                handleOpenRatingBookModal(status.label)
                return
              }

              await handleSelectReadingStatus(book, status.label)
              onUpdateStatus(book, status.label, userRating?.rate || 0)

              onClose()
            }}
          >
            {status.label}
          </ReadingStatusItem>

          <DividerDropdown />
        </>
      ))}
      <WarningMessage>
        <FontAwesomeIcon icon={faCircleInfo} />
        <p>
          Reviews are only visible when status is set to
          <strong> Read</strong> or <strong>Did not finish</strong>
        </p>
      </WarningMessage>
    </AddToLibraryDropdown>
  ) : null
}
