/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect } from 'react'
import { Pencil, Trash } from 'phosphor-react'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Dialog from '@radix-ui/react-dialog'
import { Tooltip } from 'react-tooltip'
import { DeleteModal } from '@/components/modals/DeleteModal'
import { DividerLine, Dropdown, DropdownButton, DropdownItem } from './styles'
import {
  DELETE_TOOLTIP_ID,
  EDIT_TOOLTIP_ID,
  TOOLTIP_STYLE,
} from '@/utils/constants'

interface Props {
  variant?: 'default' | 'secondary'
  hasDeleteSection?: boolean
  isSubmission?: boolean
  buttonRef: RefObject<HTMLButtonElement>
  dropdownRef: RefObject<HTMLDivElement>
  isDropdownOpen: boolean
  isDeleteSectionOpen?: boolean
  readingStatus?: string
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
  readingStatus,
  onToggleDeleteSection,
  onDelete,
  onToggleDropdown,
  onToggleEditSection,
}: Props) => {
  const isEditDisabled = !['read', 'did_not_finish'].includes(
    readingStatus || '',
  )

  const tooltipMessage =
    "Available only for books marked as 'Read' or 'Did Not Finish'"

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
  }

  useEffect(() => {
    if (!isDropdownOpen) {
      onToggleDeleteSection?.(false)
    }
  }, [isDropdownOpen])

  const renderEditItem = () => (
    <DropdownItem
      data-tooltip-content={tooltipMessage}
      data-tooltip-id={EDIT_TOOLTIP_ID}
      disabled={isEditDisabled && !isSubmission}
      className="edit_icon"
      onClick={handleEditClick}
    >
      <Pencil />
      <p>{isSubmission ? 'Edit Submission' : 'Edit Review'}</p>
    </DropdownItem>
  )

  const renderDeleteItem = () => (
    <Dialog.Root open={isDeleteSectionOpen} onOpenChange={handleDeleteClick}>
      <Dialog.Trigger asChild>
        <DropdownItem
          disabled={isEditDisabled && !isSubmission}
          className="delete_icon"
          onClick={handleDeleteClick}
          data-tooltip-id={DELETE_TOOLTIP_ID}
          data-tooltip-content={tooltipMessage}
        >
          <Trash />
          <p>{isSubmission ? 'Delete Submission' : 'Delete Review'}</p>
        </DropdownItem>
      </Dialog.Trigger>
      <DeleteModal
        onConfirm={handleDeleteConfirm}
        onClose={() => onToggleDropdown(false)}
      />
    </Dialog.Root>
  )

  const renderTooltips = () => (
    <>
      <Tooltip
        id={EDIT_TOOLTIP_ID}
        place="right"
        className="custom-tooltip"
        style={TOOLTIP_STYLE}
      />
      <Tooltip
        id={DELETE_TOOLTIP_ID}
        place="right"
        className="custom-tooltip"
        style={TOOLTIP_STYLE}
      />
    </>
  )

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
          className={`${isSubmission ? 'submission_type' : ''}`}
        >
          {renderEditItem()}
          {hasDeleteSection && (
            <>
              <DividerLine />
              {renderDeleteItem()}
            </>
          )}
          {isEditDisabled && !isSubmission && renderTooltips()}
        </Dropdown>
      )}
    </>
  )
}
