import { RefObject } from 'react'
import { Pencil, Trash } from 'phosphor-react'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Dialog from '@radix-ui/react-dialog'

import { DeleteModal } from '@/components/modals/DeleteModal'
import { Dropdown, DropdownButton, DropdownItem } from './styles'

interface Props {
  variant?: 'default' | 'secondary'
  hasDeleteSection?: boolean
  isSubmission?: boolean
  buttonRef: RefObject<HTMLButtonElement>
  dropdownRef: RefObject<HTMLDivElement>
  isDropdownOpen: boolean
  isDeleteSectionOpen?: boolean
  onToggleDeleteSection?: (value: boolean) => void
  onDelete?: () => void
  onToggleDropdown: (value: boolean) => void
  onToggleEditSection: (value: boolean) => void
}

export const DropdownActions = ({
  hasDeleteSection = true,
  isSubmission = false,
  variant = 'default',
  buttonRef,
  isDropdownOpen,
  dropdownRef,
  isDeleteSectionOpen,
  onToggleDeleteSection,
  onDelete,
  onToggleDropdown,
  onToggleEditSection,
}: Props) => {
  const handleDeleteClick = () => {
    onToggleDeleteSection?.(true)
  }

  const handleEditClick = () => {
    onToggleEditSection(true)
    onToggleDropdown(false)
  }

  const handleDeleteConfirm = () => {
    onDelete?.()
    onToggleDropdown(false)
    onToggleDeleteSection?.(false)
  }

  return (
    <>
      <DropdownButton
        ref={buttonRef}
        onClick={() => onToggleDropdown(!isDropdownOpen)}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </DropdownButton>

      {isDropdownOpen && (
        <Dropdown
          ref={dropdownRef}
          variant={variant}
          className={`${isSubmission ? 'larger' : ''}`}
        >
          <DropdownItem onClick={handleEditClick}>
            <Pencil className="edit_icon" />
            <p>{isSubmission ? 'Edit Submission' : 'Edit Review'}</p>
          </DropdownItem>

          {hasDeleteSection && (
            <Dialog.Root
              open={isDeleteSectionOpen}
              onOpenChange={handleDeleteClick}
            >
              <Dialog.Trigger asChild>
                <DropdownItem onClick={handleDeleteClick}>
                  <Trash className="delete_icon" />
                  <p>{isSubmission ? 'Delete Submission' : 'Delete Review'}</p>
                </DropdownItem>
              </Dialog.Trigger>

              <DeleteModal
                onConfirm={handleDeleteConfirm}
                onClose={() => {
                  onToggleDropdown(false)
                  onToggleDeleteSection?.(false)
                }}
              />
            </Dialog.Root>
          )}
        </Dropdown>
      )}
    </>
  )
}
