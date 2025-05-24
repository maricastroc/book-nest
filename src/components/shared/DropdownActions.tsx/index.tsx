import { Pencil, Trash } from 'phosphor-react'
import { Dropdown, DropdownButton, DropdownItem } from './styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'
import { RefObject } from 'react'
import { DeleteModal } from '@/components/modals/DeleteModal'

interface Props {
  buttonRef: RefObject<HTMLButtonElement>
  dropdownRef: RefObject<HTMLDivElement>
  isDropdownOpen: boolean
  isDeleteModalOpen: boolean
  handleSetIsDeleteModalOpen: (value: boolean) => void
  handleDeleteReview: () => void
  handleSetIsDropdownOpen: (value: boolean) => void
  handleIsEditUserReviewCardOpen: (value: boolean) => void
}

export const DropdownActions = ({
  buttonRef,
  isDropdownOpen,
  dropdownRef,
  isDeleteModalOpen,
  handleSetIsDeleteModalOpen,
  handleDeleteReview,
  handleSetIsDropdownOpen,
  handleIsEditUserReviewCardOpen,
}: Props) => {
  return (
    <>
      <DropdownButton
        ref={buttonRef}
        onClick={() => handleSetIsDropdownOpen(true)}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </DropdownButton>
      {isDropdownOpen && (
        <Dropdown ref={dropdownRef}>
          <Dialog.Root
            open={isDeleteModalOpen}
            onOpenChange={() => handleSetIsDeleteModalOpen(true)}
          >
            <Dialog.Trigger asChild>
              <DropdownItem
                onClick={() => {
                  handleSetIsDeleteModalOpen(true)
                }}
              >
                <Trash className="delete_icon" />
                <p className="delete_icon">Delete Review</p>
              </DropdownItem>
            </Dialog.Trigger>
            <DeleteModal
              onConfirm={() => {
                handleDeleteReview()
              }}
              onClose={() => {
                handleSetIsDeleteModalOpen(false)
                handleSetIsDropdownOpen(false)
              }}
            />
          </Dialog.Root>
          <DropdownItem
            onClick={() => {
              handleIsEditUserReviewCardOpen(true)
              handleSetIsDropdownOpen(false)
            }}
          >
            <Pencil className="edit_icon" />
            <p className="edit_icon">Edit Review</p>
          </DropdownItem>
        </Dropdown>
      )}
    </>
  )
}
