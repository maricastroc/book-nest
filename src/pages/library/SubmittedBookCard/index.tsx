import { BookProps } from '@/@types/book'
import {
  BookCover,
  BookTitleAndAuthor,
  BookContentWrapper,
  BookCardBox,
  FooterWrapper,
} from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppContext } from '@/contexts/AppContext'
import { useRef, useState } from 'react'
import { SubmitBookFormModal } from '@/pages/library/partials/SubmitBookFormModal'
import { DropdownActions } from '@/components/shared/DropdownActions.tsx'
import { useClickOutside } from '@/hooks/useClickOutside'

interface Props {
  userId?: string | undefined
  book: BookProps
  onClose?: () => void
  onUpdateBook?: (book: BookProps) => void
}

export function SubmittedBookCard({ book, userId, onUpdateBook }: Props) {
  const { loggedUser } = useAppContext()

  const [isEditBookFormOpen, setIsEditBookFormOpen] = useState(false)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const isLoggedUser = loggedUser?.id === userId

  const dropdownRef = useRef<HTMLDivElement>(null)

  const buttonRef = useRef<HTMLButtonElement>(null)

  useClickOutside([dropdownRef, buttonRef], () => {
    setIsDropdownOpen(false)
  })

  return (
    <BookCardBox>
      <BookCover src={book.coverUrl} />
      <BookContentWrapper>
        <BookTitleAndAuthor>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
        </BookTitleAndAuthor>
        <FooterWrapper>
          {isLoggedUser && (
            <>
              <Dialog.Root open={isEditBookFormOpen}>
                {isEditBookFormOpen && (
                  <SubmitBookFormModal
                    isEdit
                    book={book}
                    onUpdateBook={onUpdateBook}
                    onClose={() => setIsEditBookFormOpen(false)}
                  />
                )}
              </Dialog.Root>
              <DropdownActions
                isSubmission
                hasDeleteSection={false}
                readingStatus={book?.readingStatus || undefined}
                isDropdownOpen={isDropdownOpen}
                onToggleDropdown={(value) => setIsDropdownOpen(value)}
                dropdownRef={dropdownRef}
                buttonRef={buttonRef}
                onToggleEditSection={() => setIsEditBookFormOpen(true)}
              />
            </>
          )}
        </FooterWrapper>
      </BookContentWrapper>
    </BookCardBox>
  )
}
