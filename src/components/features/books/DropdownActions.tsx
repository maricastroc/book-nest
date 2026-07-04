/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect } from 'react'
import {
  faEllipsisVertical,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Dialog from '@radix-ui/react-dialog'
import { DeleteModal } from '@/components/features/books/DeleteModal'
import { useAppContext } from '@/contexts/AppContext'
import { useBookContext } from '@/contexts/BookContext'

interface Props {
  variant?: 'default' | 'secondary'
  hasDeleteSection?: boolean
  isSubmission?: boolean
  buttonRef: RefObject<HTMLButtonElement>
  dropdownRef: RefObject<HTMLDivElement>
  isDropdownOpen: boolean
  isDeleteSectionOpen?: boolean
  ratingId: string
  onToggleDeleteSection?: (value: boolean) => void
  onToggleDropdown: (value: boolean) => void
  onToggleEditSection: (value: boolean) => void
}

export const DropdownActions = ({
  isSubmission = false,
  buttonRef,
  isDropdownOpen,
  dropdownRef,
  isDeleteSectionOpen,
  ratingId,
  onToggleDeleteSection,
  onToggleDropdown,
  onToggleEditSection,
}: Props) => {
  const { handleDeleteReview } = useAppContext()
  const { actions, bookData } = useBookContext()

  const handleDeleteClick = () => {
    onToggleDeleteSection?.(true)
  }

  const handleEditClick = () => {
    onToggleEditSection(true)
    onToggleDropdown(false)
  }

  const handleDeleteConfirm = async () => {
    actions.updateUserRating(null)

    await handleDeleteReview(ratingId)
    await actions.updateRating?.()
    await bookData?.mutate()
    onToggleDropdown(false)
  }

  useEffect(() => {
    if (!isDropdownOpen) {
      onToggleDeleteSection?.(false)
    }
  }, [isDropdownOpen])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => onToggleDropdown(!isDropdownOpen)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-white/6 text-fg3 transition-colors hover:bg-white/12 hover:text-fg focus:outline-none"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} className="text-[1rem]" />
      </button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-[calc(100%+8px)] z-9997 min-w-48 overflow-hidden rounded-xl border border-line bg-el p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.55)]"
        >
          <button
            onClick={handleEditClick}
            className="flex w-full cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-lg border-0 bg-transparent px-3.5 py-2.5 text-left text-[0.9rem] font-medium text-fg2 transition-colors hover:bg-white/6 hover:text-fg"
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="w-[1rem] text-[0.9rem] text-ac"
            />
            <span>{isSubmission ? 'Edit Submission' : 'Edit Review'}</span>
          </button>

          <div className="my-1 h-px bg-line" />

          <Dialog.Root
            open={isDeleteSectionOpen}
            onOpenChange={handleDeleteClick}
          >
            <Dialog.Trigger asChild>
              <button
                onClick={handleDeleteClick}
                className="flex w-full cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-lg border-0 bg-transparent px-3.5 py-2.5 text-left text-[0.9rem] font-medium transition-colors hover:bg-white/6"
              >
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="w-[1rem] text-[0.9rem] text-danger"
                />
                <span>
                  {isSubmission ? 'Delete Submission' : 'Delete Review'}
                </span>
              </button>
            </Dialog.Trigger>
            <DeleteModal
              onConfirm={handleDeleteConfirm}
              onClose={() => onToggleDropdown(false)}
            />
          </Dialog.Root>
        </div>
      )}
    </div>
  )
}
