import { BookProps } from '@/@types/book'
import { StarsRating } from '@/components/shared/StarsRating'
import {
  BookCover,
  BookTitleAndAuthor,
  BookContentWrapper,
  BookCardBox,
  RatingWrapper,
  FooterWrapper,
} from './styles'
import { getBookRatingsNumber } from '@/utils/getBookRatingsNumber'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppContext } from '@/contexts/AppContext'
import { useRef, useState } from 'react'
import { SubmitBookFormModal } from '@/pages/library/partials/SubmitBookFormModal'
import { ReadingStatusTag } from '@/components/shared/ReadingStatusTag'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { DropdownActions } from '@/components/shared/DropdownActions.tsx'
import { useClickOutside } from '@/hooks/useClickOutside'

interface BookCardProps {
  isLibraryPage?: boolean
  isExplorePage?: boolean
  libraryPageUserId?: string | undefined
  book: BookProps
  onOpenDetails: () => void
  size?: string
  onClose?: () => void
  onUpdateBook?: (book: BookProps) => void
}

export function BookCard({
  book,
  onOpenDetails,
  libraryPageUserId,
  size = '',
  isLibraryPage = false,
  onUpdateBook,
}: BookCardProps) {
  const { loggedUser } = useAppContext()

  const [isEditBookFormOpen, setIsEditBookFormOpen] = useState(false)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const isLoggedUser = loggedUser?.id === libraryPageUserId

  const dropdownRef = useRef<HTMLDivElement>(null)

  const buttonRef = useRef<HTMLButtonElement>(null)

  useClickOutside([dropdownRef, buttonRef], () => {
    setIsDropdownOpen(false)
  })

  return (
    <BookCardBox
      className={`${size} ${isLibraryPage ? 'library_style' : ''}`}
      onClick={() => {
        if (!isLibraryPage) {
          onOpenDetails()
        }
      }}
    >
      <BookCover
        className={`${size} ${isLibraryPage ? 'library_style' : ''}`}
        src={book.coverUrl}
        onClick={() => onOpenDetails()}
      />
      <BookContentWrapper>
        {isLibraryPage
          ? libraryPageUserId === loggedUser?.id &&
            book?.readingStatus && (
              <ReadingStatusTag
                readingStatus={formatToSnakeCase(book.readingStatus)}
              />
            )
          : book?.readingStatus && (
              <ReadingStatusTag
                readingStatus={formatToSnakeCase(book.readingStatus)}
              />
            )}
        <BookTitleAndAuthor className={size}>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
        </BookTitleAndAuthor>
        <FooterWrapper className={isLibraryPage ? 'library_style' : ''}>
          {!isLibraryPage && (
            <RatingWrapper className={isLibraryPage ? 'library_style' : ''}>
              <p>{getBookRatingsNumber(book)}</p>
              <StarsRating size={size} rating={book?.rate ?? 0} />
            </RatingWrapper>
          )}
          {isLoggedUser && isLibraryPage && (
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
