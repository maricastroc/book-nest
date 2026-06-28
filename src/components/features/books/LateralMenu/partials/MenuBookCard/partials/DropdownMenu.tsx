import { BookProps } from '@/@types/book'
import { useAppContext } from '@/contexts/AppContext'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { ReadingStatus, statuses } from '@/@types/reading-status'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import toast from 'react-hot-toast'
import { useUserStatistics } from '@/hooks/useUserStatistics'
import { useBookContext } from '@/contexts/BookContext'

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
  const { actions } = useBookContext()
  const { mutateStatistics } = useUserStatistics(String(loggedUser?.id))

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
        mutateStatistics()
        await actions.updateRating?.()
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
          data: { userId: loggedUser.id, bookId: book.id },
        })
        mutateStatistics()
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

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-[calc(100%+6px)] z-999 w-full overflow-hidden rounded-[10px] border border-line bg-el py-1 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
    >
      {statuses?.map((status, i) => (
        <div key={status.value}>
          <button
            className={`flex h-10 w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-4 text-[0.875rem] font-medium transition-colors ${
              activeStatus === status.value
                ? 'text-fg'
                : 'text-fg2 hover:bg-white/5 hover:text-fg'
            } disabled:cursor-not-allowed disabled:text-fg3`}
            onClick={async () => {
              if (activeStatus === status.value) return
              await handleSelectReadingStatus(book, status.value)
              onUpdateStatus(status.value)
              onClose()
            }}
          >
            {status.label}
          </button>
          {i < statuses.length - 1 && (
            <span className="mx-4 block h-px bg-white/6" />
          )}
        </div>
      ))}

      {activeStatus !== null && (
        <>
          <span className="mx-4 mt-1 block h-px bg-white/6" />
          <button
            onClick={handleRemoveFromLibrary}
            className="flex h-10 w-full items-center gap-2.5 border-none bg-transparent px-4 text-[0.875rem] font-medium text-red-400/70 transition-colors hover:bg-red-500/8 hover:text-red-400"
          >
            <FontAwesomeIcon icon={faTrash} className="text-[0.8rem]" />
            Remove from library
          </button>
        </>
      )}
    </div>
  )
}
